from pathlib import Path

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        secrets_dir = "/run/secrets" if Path("/run/secrets").exists() else None


settings = Settings()  # type: ignore[call-arg]
