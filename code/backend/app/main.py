import tempfile

from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

import uvicorn

from fastapi import Depends, FastAPI
from sqlmodel import Session, SQLModel, create_engine

from app.database.models.discussion import Discussion
from app.database.session import get_session


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    # TODO: Replace with PostgreSQL database...
    app.state.engine = create_engine(f"sqlite:///{tempfile.gettempdir()}/database.db")

    SQLModel.metadata.create_all(app.state.engine)

    yield


app = FastAPI(
    lifespan=lifespan,
)


@app.get("/")
async def root(session: Session = Depends(get_session)) -> Discussion:
    discussion = Discussion(
        name="Lorem Ipsum",
        description="Lorem Ipsum",
    )
    session.add(discussion)
    session.commit()
    session.refresh(discussion)
    return discussion


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, server_header=False)
