import logging

from collections.abc import AsyncGenerator, Iterable
from contextlib import asynccontextmanager

import uvicorn

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import create_engine

from app.database import create_db_and_tables
from app.logging import HealthCheckFilter
from app.routers import discussions, messages, reports
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

if settings.cors_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(cors_origin).removesuffix("/") for cors_origin in settings.cors_origins]
        if isinstance(settings.cors_origins, Iterable)
        else str(settings.cors_origins).removesuffix("/"),
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(discussions.router)
app.include_router(messages.router)
app.include_router(reports.router)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, server_header=False)
