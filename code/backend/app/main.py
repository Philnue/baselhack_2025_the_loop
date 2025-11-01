import logging

from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

import uvicorn

from fastapi import FastAPI
from sqlmodel import create_engine

from app.database import create_db_and_tables
from app.logging import HealthCheckFilter
from app.routers import discussions, messages
from app.settings import settings


logging.getLogger("uvicorn.access").addFilter(HealthCheckFilter())


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    app.state.engine = create_engine(
        f"postgresql+psycopg://{settings.database_user}:{settings.database_password.get_secret_value()}@{settings.database_host}:{settings.database_port}/{settings.database_name}",
    )

    create_db_and_tables(app.state.engine)

    yield


app = FastAPI(
    lifespan=lifespan,
)

app.include_router(discussions.router)
app.include_router(messages.router)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, server_header=False)
