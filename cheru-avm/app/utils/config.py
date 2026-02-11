from functools import lru_cache
from typing import List

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = Field(
        default="sqlite:///./cheru_avm.db",
        alias="DATABASE_URL",
    )
    allowed_origins: List[str] = Field(default_factory=lambda: ["*"])


    @field_validator("database_url", mode="before")
    @classmethod
    def validate_database_url(cls, value):
        if isinstance(value, str) and not value.strip():
            return "sqlite:///./cheru_avm.db"
        return value

    @field_validator("allowed_origins", mode="before")
    @classmethod
    def split_origins(cls, value):
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value

    class Config:
        env_file = ".env"
        populate_by_name = True


@lru_cache
def get_settings() -> Settings:
    return Settings()
