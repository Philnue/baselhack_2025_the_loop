import logging
import tempfile

from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

import uvicorn

from fastapi import FastAPI
from sqlmodel import SQLModel, create_engine

from app.logging import HealthCheckFilter
from app.routers import discussion


logging.getLogger("uvicorn.access").addFilter(HealthCheckFilter())


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    # TODO: Replace with PostgreSQL database...
    app.state.engine = create_engine(f"sqlite:///{tempfile.gettempdir()}/database.db")

    SQLModel.metadata.create_all(app.state.engine)

    yield


app = FastAPI(
    lifespan=lifespan,
)

app.include_router(discussion.router)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, server_header=False)
