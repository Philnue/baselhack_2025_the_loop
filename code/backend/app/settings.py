from pathlib import Path

from pydantic import SecretStr
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        secrets_dir = "/run/secrets" if Path("/run/secrets").exists() else None

    read_only: bool = False

    database_host: str
    database_port: int
    database_name: str
    database_user: str
    database_password: SecretStr

    azure_openai_endpoint: str
    azure_openai_api_key: SecretStr
    azure_openai_api_version: str = "2025-04-01-preview"
    azure_openai_model: str = "gpt-4o"


settings = Settings()  # type: ignore[call-arg]
