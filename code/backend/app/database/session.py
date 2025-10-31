from collections.abc import Generator

from fastapi import Request
from sqlmodel import Session


def get_session(request: Request) -> Generator[Session, None, None]:
    with Session(request.app.state.engine) as session:
        yield session
