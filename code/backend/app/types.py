from enum import Enum

from pydantic import BaseModel, Field


class Category(str, Enum):
    BINARY_PROPOSAL = "BINARY_PROPOSAL"
    PRIORITIZATION_RANKING = "PRIORITIZATION_RANKING"
    BRAINSTORMING_IDEATION = "BRAINSTORMING_IDEATION"
    FEEDBACK_RETROSPECTIVE = "FEEDBACK_RETROSPECTIVE"
    FORECASTING_PLANNING = "FORECASTING_PLANNING"


class Sentiment(str, Enum):
    POSITIVE = "POSITIVE"
    NEUTRAL = "NEUTRAL"
    NEGATIVE = "NEGATIVE"


class Emotion(str, Enum):
    ANTICIPATION = "ANTICIPATION"
    JOY = "JOY"
    TRUST = "TRUST"
    SURPRISE = "SURPRISE"
    ANGER = "ANGER"
    FEAR = "FEAR"
    SADNESS = "SADNESS"
    DISGUST = "DISGUST"


class IsAgainst(str, Enum):
    YES = "YES"
    NO = "NO"
    MIXED = "MIXED"


class EvidenceType(str, Enum):
    DATA = "DATA"
    BENCHMARK = "BENCHMARK"
    CITATION = "CITATION"
    ANECDOTE = "ANECDOTE"
    EXPERT_OPINION = "EXPERT_OPINION"
    ASSUMPTION = "ASSUMPTION"


class IsAgreeing(str, Enum):
    YES = "YES"
    NO = "NO"
    MAYBE = "MAYBE"


class PriorityClass(str, Enum):
    MUST = "MUST"
    SHOULD = "SHOULD"
    COULD = "COULD"
    WONT = "WONT"


class Actionability(str, Enum):
    QUICK_WIN = "QUICK_WIN"
    NEEDS_RESEARCH = "NEEDS_RESEARCH"
    BIG_BET = "BIG_BET"
    NOT_USEFUL = "NOT_USEFUL"


class ImpactDirection(str, Enum):
    HELPED = "HELPED"
    NEUTRAL = "NEUTRAL"
    HURT = "HURT"


class DeliveryStatus(str, Enum):
    AHEAD = "AHEAD"
    ON_TRACK = "ON_TRACK"
    AT_RISK = "AT_RISK"
    BLOCKED = "BLOCKED"


class CommonDimensions(BaseModel):
    theme: str | None = None
    sentiment: Sentiment
    emotion: Emotion
    is_critical_opinion: bool
    risk_flag: bool
    confidence: float = Field(ge=0.0, le=1.0)
    relevancy: float = Field(ge=0, le=1.0)
    is_against: IsAgainst
    evidence_type: EvidenceType

    stance_sentiment_mismatch: bool | None = None
    confidence_evidence_mismatch: bool | None = None

    text: str


class BinaryProposal(CommonDimensions):
    is_agreeing: IsAgreeing


class PrioritizationRanking(CommonDimensions):
    priority_class: PriorityClass


class BrainstormingIdeation(CommonDimensions):
    actionability: Actionability


class FeedbackRetrospective(CommonDimensions):
    impact_direction: ImpactDirection


class ForecastingPlanning(CommonDimensions):
    delivery_status: DeliveryStatus


Dimensions = (
    BinaryProposal | PrioritizationRanking | BrainstormingIdeation | FeedbackRetrospective | ForecastingPlanning
)


class Summary(BaseModel):
    main_summary: str
    conficting_statement: str
    top_weighted_points: list[str]
