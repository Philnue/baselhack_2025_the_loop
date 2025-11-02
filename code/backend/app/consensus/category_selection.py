from typing import cast

from langchain_core.language_models import BaseChatModel, LanguageModelInput
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import Runnable, RunnableConfig
from langgraph.graph import END, START, StateGraph
from langgraph.graph.state import CompiledStateGraph
from pydantic import BaseModel

from app.models import Discussion
from app.types import Category


CATEGORY_EXTRACTION_SYSTEM_PROMPT = """You are a classifier. Your task is to read a short "name" and "description" and assign EXACTLY ONE category from this fixed set:

1) BINARY_PROPOSAL — yes/no or approve/reject decisions. Examples: "Should we adopt Tool X?", "Approve design v3?", "Greenlight hiring?"
2) PRIORITIZATION_RANKING — ordering, top-N lists, what to do first. Examples: "Which features first?", "Top 5 tech debts?", "Rank backlog items."
3) BRAINSTORMING_IDEATION — divergent idea generation, suggestions, options. Examples: "Ideas to reduce downtime?", "Sustainable workplace actions?", "Ways to improve onboarding?"
4) FEEDBACK_RETROSPECTIVE — reflections, ratings, lessons learned, what went well/poorly. Examples: "What slowed us?", "Rate our collaboration", "Post-mortem insights."
5) FORECASTING_PLANNING — timelines, estimates, roadmaps, resources, ROI. Examples: "When will Feature Y be ready?", "Expected ROI?", "Q3 delivery plan."

Decision rules:
- Choose the SINGLE best-fitting category based on the dominant intent.
- If it asks for approval/decision → BINARY_PROPOSAL.
- If it asks to rank/sequence/choose first items → PRIORITIZATION_RANKING.
- If it asks for new ideas/suggestions/options without ranking → BRAINSTORMING_IDEATION.
- If it asks to reflect/evaluate/pulse-check/retrospect → FEEDBACK_RETROSPECTIVE.
- If it asks for when/how long/plan/estimate/ROI/capacity → FORECASTING_PLANNING.
- If multiple seem plausible, select the one that most directly answers the user's immediate ask (primary verb or question form).
- Always output one of the five categories; never invent new categories.

Input:
- topic: <string>
- description: <string>

Output format (STRICT):
Return ONLY a single-line JSON object with exactly this shape and casing, no extra text, no explanations:
{{"category":"<one of: BINARY_PROPOSAL | PRIORITIZATION_RANKING | BRAINSTORMING_IDEATION | FEEDBACK_RETROSPECTIVE | FORECASTING_PLANNING>"}}

Examples (do NOT include these in your output):
- topic: "Adopt Tool X?", description: "Team trialed it; decide this week." → {{"category":"BINARY_PROPOSAL"}}
- topic: "Pick Q1 focus", description: "Choose top 3 features to do first." → {{"category":"PRIORITIZATION_RANKING"}}
- topic: "Reduce downtime", description: "Looking for fresh ideas." → {{"category":"BRAINSTORMING_IDEATION"}}
- topic: "Sprint retro", description: "What blocked us? Rate collaboration." → {{"category":"FEEDBACK_RETROSPECTIVE"}}
- topic: "Feature Y ETA", description: "When will it be ready? ROI estimate?" → {{"category":"FORECASTING_PLANNING"}}

Now classify the provided topic and description and return ONLY the JSON object exactly as specified."""

CATEGORY_EXTRACTION_PROMPT_TEMPLATE = ChatPromptTemplate.from_messages(
    [
        ("system", CATEGORY_EXTRACTION_SYSTEM_PROMPT),
        ("user", "Topic: {topic}\nDescription: {description}"),
    ]
)


class CategorySelectionGraphState(BaseModel):
    discussion: Discussion
    category: Category | None = None


def has_discussion_template(state: CategorySelectionGraphState) -> bool:
    return state.discussion.template is not None


def extract_category_from_discussion_template(state: CategorySelectionGraphState) -> dict:
    return {"category": state.discussion.template}


def extract_category_from_discussion(state: CategorySelectionGraphState, config: RunnableConfig) -> dict:
    llm = cast(BaseChatModel, config["configurable"]["llm"])
    structured_llm = cast(
        Runnable[LanguageModelInput, Category],
        llm.with_structured_output(Category),
    )

    chain = CATEGORY_EXTRACTION_PROMPT_TEMPLATE | structured_llm

    category = chain.invoke(
        {
            "topic": state.discussion.name,
            "description": state.discussion.description,
        }
    )

    return {"category": category}


category_selection_graph_builder = StateGraph(CategorySelectionGraphState)
category_selection_graph_builder.add_node(extract_category_from_discussion_template)
category_selection_graph_builder.add_node(extract_category_from_discussion)

category_selection_graph_builder.add_conditional_edges(
    START,
    has_discussion_template,
    path_map={
        True: "extract_category_from_discussion_template",
        False: "extract_category_from_discussion",
    },
)

category_selection_graph_builder.add_edge("extract_category_from_discussion_template", END)
category_selection_graph_builder.add_edge("extract_category_from_discussion", END)

category_selection_graph: CompiledStateGraph = category_selection_graph_builder.compile()
