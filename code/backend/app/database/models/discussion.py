import uuid

from sqlmodel import Field, SQLModel


class Discussion(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str
    description: str
