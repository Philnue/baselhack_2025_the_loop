import enum
import uuid

from datetime import datetime
from typing import Annotated, Any

from sqlmodel import ARRAY, JSON, Column, Enum, Field, Relationship, SQLModel, Text


class DiscussionTemplate(str, enum.Enum):
    FEATURE_PRIORITIZATION = "FEATURE_PRIORITIZATION"
    POLICY_FEEDBACK = "POLICY_FEEDBACK"
    TOOL_ADOPTION = "TOOL_ADOPTION"


class DiscussionBase(SQLModel):
    template: Annotated[DiscussionTemplate | None, Field(sa_column=Column(Enum(DiscussionTemplate)))] = None
    name: str = Field(sa_type=Text)
    description: str = Field(sa_type=Text)
    tags: set[str] = Field(default_factory=set, sa_column=Column(ARRAY(item_type=Text, as_tuple=True)))


class Discussion(DiscussionBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    owner_id: uuid.UUID
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    messages: list["Message"] = Relationship(
        back_populates="discussion", cascade_delete=True, sa_relationship_kwargs={"order_by": "Message.created_at"}
    )
    report: dict[str, Any] | None = Field(default=None, sa_column=Column(JSON))
    report_progress: Annotated[float | None, Field(ge=0, le=1)] = None


class DiscussionCreate(DiscussionBase):
    owner_id: uuid.UUID


class DiscussionPublic(DiscussionBase):
    id: uuid.UUID
    owner_id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    report: dict[str, Any] | None
    report_progress: float | None


class DiscussionPublicWithMessages(DiscussionPublic):
    messages: list["MessagePublicWithoutDiscussionId"]


class DiscussionUpdate(SQLModel):
    owner_id: uuid.UUID
    name: str | None = None
    description: str | None = None
    tags: set[str] | None = None


class DiscussionUpdateWithReport(SQLModel):
    name: str | None = None
    description: str | None = None
    tags: set[str] | None = None
    report: dict[str, Any] | None = None
    report_progress: float | None = None


class MessageBase(SQLModel):
    message: str = Field(sa_type=Text)

    discussion_id: uuid.UUID = Field(foreign_key="discussion.id")


class Message(MessageBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    owner_id: uuid.UUID
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    discussion: Discussion = Relationship(back_populates="messages")


class MessageCreate(MessageBase):
    owner_id: uuid.UUID


class MessagePublic(MessageBase):
    id: uuid.UUID
    owner_id: uuid.UUID
    created_at: datetime
    updated_at: datetime


class MessagePublicWithoutDiscussionId(SQLModel):
    id: uuid.UUID
    owner_id: uuid.UUID
    message: str
    created_at: datetime
    updated_at: datetime


class MessagePublicWithDiscussion(MessagePublicWithoutDiscussionId):
    discussion: Discussion


class MessageUpdate(SQLModel):
    owner_id: uuid.UUID
    message: str | None = None
