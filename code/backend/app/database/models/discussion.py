import uuid

from sqlmodel import Field, SQLModel


class DiscussionBase(SQLModel):
    name: str
    description: str


class Discussion(DiscussionBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)


class DiscussionCreate(DiscussionBase):
    pass


class DiscussionPublic(DiscussionBase):
    id: uuid.UUID
