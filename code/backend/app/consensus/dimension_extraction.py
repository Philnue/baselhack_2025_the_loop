from functools import partial
from typing import cast

from langchain_core.language_models import BaseChatModel, LanguageModelInput
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import Runnable, RunnableConfig
from langgraph.graph import END, START, StateGraph
from langgraph.graph.state import CompiledStateGraph
from pydantic import BaseModel

from app.models import Discussion
from app.types import (
    BinaryProposal,
    BrainstormingIdeation,
    Category,
    Dimensions,
    FeedbackRetrospective,
    ForecastingPlanning,
    PrioritizationRanking,
)


DIMENSION_EXTRACTION_SYSTEM_PROMPT = """You are an information extractor. Given a known category, a topic, and a text note, you must extract standardized dimensions.
Follow ALL rules exactly. Return ONLY a single JSON object. No prose, no markdown.

INPUTS
- category: one of {{"BINARY_PROPOSAL", "PRIORITIZATION_RANKING", "BRAINSTORMING_IDEATION", "FEEDBACK_RETROSPECTIVE", "FORECASTING_PLANNING"}}
- topic: string (the subject or prompt context)
- text: string (the user-provided statement)

DIMENSIONS TO EXTRACT (COMMON)
1) theme
- Primary topic cluster, 1-4 word noun phrase (e.g., "Deployment Speed", "SSO/Access"). Exactly one.

2) sentiment
- One of {{"POSITIVE", "NEUTRAL", "NEGATIVE"}} based on stance toward the subject (not writing style). If mixed, weigh the main claim.

3) emotion
- One of {{"ANTICIPATION", "JOY", "TRUST", "SURPRISE", "ANGER", "FEAR", "SADNESS", "DISGUST"}}; pick the dominant emotion or null.

4) is_critical_opinion
- boolean. True if the text contains a substantive claim that could influence a decision (claim + rationale, or a specific blocker/request).
- If text_to_topic_relevancy < 40, force is_critical_opinion = false (unless the topic explicitly indicates "parking lot").

5) risk_flag
- boolean. True if unsafe content appears (any of: profanity/slurs/harassment/hate; sexual content/harassment; threats/violence; self-harm; PII exposure; credentials/secrets; extremism; illicit requests).

6) confidence
- Float in [0.0, 1.0].
- Use explicit probabilities if present (e.g., "70%"→0.7). Otherwise infer from hedging/intensity:
    HIGH ≈ 0.75-0.95 ("definitely", "data shows"), MEDIUM ≈ 0.4-0.74 ("likely"), LOW ≈ 0.1-0.39 ("might", "could").

7) text_to_topic_relevancy
- Integer in [0,100]. Compute via semantic similarity to the topic + keyword overlap.
- Buckets (for your internal reasoning only): <40 Off, 40-69 Peripheral, 70-84 On, 85-100 Laser. (Do not output the bucket.)

8) is_against
- One of {{"YES", "NO", "MIXED"}}: stance against the main proposition/option.

9) evidence_type
- One of {{"DATA", "BENCHMARK", "CITATION", "ANECDOTE", "EXPERT_OPINION", "ASSUMPTION"}}.
- Choose the strongest present (DATA > BENCHMARK > CITATION > EXPERT_OPINION > ANECDOTE > ASSUMPTION).

CATEGORY-SPECIFIC DIMENSION (EXACTLY ONE, CHOSEN BY category)
- If category == "BINARY_PROPOSAL":
    "is_agreeing" ∈ {{"YES", NO", "MAYBE"}}.
- If category == "PRIORITIZATION_RANKING":
    "priority_class" ∈ {{"MUST", "SHOULD", "COULD", "WONT"}} (MoSCoW).
    Heuristics: must-have/critical/top ~20% → Must; next ~30% → Should; next ~40% → Could; explicitly excluded → Won't.
    Respect explicit language if present ("must-have","low priority","nice to have").
- If category == "BRAINSTORMING_IDEATION":
    "actionability" ∈ {{"QUICK_WIN", "NEEDS_RESEARCH", "BIG_BET", "NOT_USEFUL"}}.
    Cues: "prototype/small change/low effort" → Quick Win; "unknowns/spikes"→Needs Research; "large scope/high risk/strategic"→Big Bet; "irrelevant/duplicative/unfeasible"→Not Useful.
- If category == "FEEDBACK_RETROSPECTIVE":
    "impact_direction" ∈ {{"HELPED", "NEUTRAL", "HURT"}} based on outcome cues ("unblocked/improved"→Helped; "blocked/slowed/regressed"→Hurt).
- If category == "FORECASTING_PLANNING":
    "delivery_status" ∈ {{"AHEAD", "ON_TRACK", "AT_RISK", "BLOCKED"}}.
    Derive from variance vs. plan, explicit risks/dependencies. "Blocked" overrides all.

CROSS-FIELD CONSISTENCY FLAGS (include when true; omit when false)
- stance_sentiment_mismatch: true if is_against == "YES" but sentiment != "NEGATIVE", or is_against == "NO" but sentiment == "NEGATIVE".
- confidence_evidence_mismatch: true if confidence.bucket == "HIGH" while evidence_type == "ASSUMPTION".

GUARDRAILS (REDACTION & SAFETY FOR OUTPUT TEXT)
- Include the user's text in the output under the "text" field:
- If risk_flag == false: output the original text verbatim.
- If risk_flag == true: redact risky spans and output the sanitized version.
- Redact the following with "[REDACTED]": PII (emails, phone numbers, addresses, IDs, bank/IBAN), credentials/secrets (API keys, tokens, passwords, SSH keys), profanity/slurs, harassment/hate, sexual content/harassment, threats/violence, self-harm content, extremism promotion, and illicit-instruction details. Never output links/tokens/keys.
- Set risk_flag = true whenever any redaction occurs.

OUTPUT FORMAT - STRICT JSON ONLY
Return exactly one JSON object with:
{{
    "theme": "<string>",
    "sentiment": "POSITIVE|NEUTRAL|NEGATIVE",
    "emotion": "ANTICIPATION|JOY|TRUST|SURPRISE|ANGER|FEAR|SADNESS|DISGUST|null",
    "is_critical_opinion": true|false,
    "risk_flag": true|false,
    "confidence": <float>,
    "text_to_topic_relevancy": <int>,
    "is_against": "YES|NO|MIXED",
    "evidence_type": "DATA|BENCHMARK|CITATION|ANECDOTE|EXPERT_OPINION|ASSUMPTION",

    // EXACTLY ONE of the following based on `category`:
    "is_agreeing": "YES|NO|MAYBE",
    "priority_class": "MUST|SHOULD|COULD|WONT",
    "actionability": "QUICK_WIN|NEEDS_RESEARCH|BIG_BET|NOT_USEFUL",
    "impact_direction": "HELPED|NEUTRAL|HURT",
    "delivery_status": "AHEAD|ON_TRACK|AT_RISK|BLOCKED",

    // Always include the user's text (possibly redacted per guardrails):
    "text": "<original or redacted user text>"
}}

If a value cannot be determined, use null (for strings) or the nearest valid default rule above; do NOT invent labels outside the allowed sets.
Do not add extra fields. Do not include explanations."""


CATEGORY_EXTRACTION_PROMPT_TEMPLATE = ChatPromptTemplate.from_messages(
    [
        ("system", DIMENSION_EXTRACTION_SYSTEM_PROMPT),
        ("user", "Category: {category}\nTopic: {topic}\nOpinion: {opinion}"),
    ]
)


class DimensionExtractionGraphState(BaseModel):
    discussion: Discussion
    category: Category
    dimensions: list[Dimensions] | None = None


def return_category(state: DimensionExtractionGraphState) -> Category:
    return state.category


def extraction_dimensions(
    state: DimensionExtractionGraphState,
    config: RunnableConfig,
    schema: type[Dimensions],
) -> dict:
    llm = cast(BaseChatModel, config["configurable"]["llm"])
    structured_llm = cast(
        Runnable[
            LanguageModelInput,
            Dimensions,
        ],
        llm.with_structured_output(schema),
    )

    chain = CATEGORY_EXTRACTION_PROMPT_TEMPLATE | structured_llm

    dimensions = chain.batch(
        [
            {
                "category": state.category,
                "topic": state.discussion.name,
                "opinion": message.message,
            }
            for message in state.discussion.messages
        ]
    )

    return {"dimensions": dimensions}


dimension_extraction_graph_builder = StateGraph(DimensionExtractionGraphState)
dimension_extraction_graph_builder.add_node(
    "extraction_binary_proposal_dimensions", partial(extraction_dimensions, schema=BinaryProposal)
)
dimension_extraction_graph_builder.add_node(
    "extraction_prioritization_ranking_dimensions", partial(extraction_dimensions, schema=PrioritizationRanking)
)
dimension_extraction_graph_builder.add_node(
    "extraction_brainstorming_ideation_dimensions", partial(extraction_dimensions, schema=BrainstormingIdeation)
)
dimension_extraction_graph_builder.add_node(
    "extraction_feedback_retrospective_dimensions", partial(extraction_dimensions, schema=FeedbackRetrospective)
)
dimension_extraction_graph_builder.add_node(
    "extraction_forecasting_planning_dimensions", partial(extraction_dimensions, schema=ForecastingPlanning)
)

dimension_extraction_graph_builder.add_conditional_edges(
    START,
    return_category,
    path_map={
        Category.BINARY_PROPOSAL: "extraction_binary_proposal_dimensions",
        Category.PRIORITIZATION_RANKING: "extraction_prioritization_ranking_dimensions",
        Category.BRAINSTORMING_IDEATION: "extraction_brainstorming_ideation_dimensions",
        Category.FEEDBACK_RETROSPECTIVE: "extraction_feedback_retrospective_dimensions",
        Category.FORECASTING_PLANNING: "extraction_forecasting_planning_dimensions",
    },
)

dimension_extraction_graph_builder.add_edge("extraction_binary_proposal_dimensions", END)
dimension_extraction_graph_builder.add_edge("extraction_prioritization_ranking_dimensions", END)
dimension_extraction_graph_builder.add_edge("extraction_brainstorming_ideation_dimensions", END)
dimension_extraction_graph_builder.add_edge("extraction_feedback_retrospective_dimensions", END)
dimension_extraction_graph_builder.add_edge("extraction_forecasting_planning_dimensions", END)

dimension_extraction_graph: CompiledStateGraph = dimension_extraction_graph_builder.compile()
