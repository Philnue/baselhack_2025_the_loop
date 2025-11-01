import enum
import uuid

from typing import Annotated

from sqlmodel import ARRAY, Column, Enum, Field, Relationship, SQLModel, Text


class DiscussionTemplate(str, enum.Enum):
    FEATURE_PRIORITIZATION = "FEATURE_PRIORITIZATION"
    POLICY_FEEDBACK = "POLICY_FEEDBACK"
    TOOL_ADAPTION = "TOOL_ADAPTION"
    FEATURE_PRIORIZATION = "FEATURE_PRIORIZATION"


class DiscussionBase(SQLModel):
    template: Annotated[DiscussionTemplate | None, Field(sa_column=Column(Enum(DiscussionTemplate)))] = None
    name: str = Field(sa_type=Text)
    description: str = Field(sa_type=Text)
    tags: set[str] = Field(default_factory=set, sa_column=Column(ARRAY(item_type=Text, as_tuple=True)))


class Discussion(DiscussionBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    owner_id: uuid.UUID
    messages: list["Message"] = Relationship(back_populates="discussion")


class DiscussionCreate(DiscussionBase):
    owner_id: uuid.UUID


class DiscussionPublic(DiscussionBase):
    id: uuid.UUID


class DiscussionPublicWithMessages(DiscussionPublic):
    messages: list["MessagePublicWithoutDiscussionId"]


class DiscussionUpdate(SQLModel):
    owner_id: uuid.UUID
    name: str | None = None
    description: str | None = None
    tags: set[str] | None = None


class MessageBase(SQLModel):
    message: str = Field(sa_type=Text)

    discussion_id: uuid.UUID = Field(foreign_key="discussion.id")


class Message(MessageBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    owner_id: uuid.UUID
    discussion: Discussion = Relationship(back_populates="messages")


class MessageCreate(MessageBase):
    owner_id: uuid.UUID


class MessagePublic(MessageBase):
    id: uuid.UUID


class MessagePublicWithoutDiscussionId(SQLModel):
    id: uuid.UUID
    message: str


class MessagePublicWithDiscussion(MessagePublicWithoutDiscussionId):
    discussion: Discussion


class MessageUpdate(SQLModel):
    owner_id: uuid.UUID
    message: str | None = None
