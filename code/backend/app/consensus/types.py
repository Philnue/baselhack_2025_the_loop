from enum import Enum


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
