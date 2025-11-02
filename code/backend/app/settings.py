from pathlib import Path
from typing import Literal

from pydantic import AnyHttpUrl, SecretStr, field_validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        secrets_dir = "/run/secrets" if Path("/run/secrets").exists() else None

    read_only_mode: bool = False
    cors_origins: AnyHttpUrl | Literal["*"] | list[AnyHttpUrl | Literal["*"]] = []

    database_host: str
    database_port: int
    database_name: str
    database_user: str
    database_password: SecretStr

    azure_openai_endpoint: str
    azure_openai_api_key: SecretStr
    azure_openai_api_version: str = "2025-04-01-preview"
    azure_openai_model: str = "gpt-4o"

    @field_validator("cors_origins", mode="before")
    def assemble_cors_origins(cls, v: str | list[str]) -> list[str]:
        if isinstance(v, str):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, list):
            return v
        raise ValueError(v)


settings = Settings()  # type: ignore[call-arg]
