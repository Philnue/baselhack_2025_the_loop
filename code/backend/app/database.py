from collections.abc import Generator

from fastapi import Request
from sqlalchemy.engine import Connection, Engine
from sqlalchemy.engine.mock import MockConnection
from sqlmodel import Session, SQLModel


def get_session(request: Request) -> Generator[Session, None, None]:
    with Session(request.app.state.engine) as session:
        yield session


def create_db_and_tables(engine: Engine | Connection | MockConnection) -> None:
    SQLModel.metadata.create_all(engine)
