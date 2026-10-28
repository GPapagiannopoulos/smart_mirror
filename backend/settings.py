"""File containing the settings class"""
from pydantic import Field, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")

    WEATHER_API_URL: str = "https://api.open-meteo.com/v1/forecast"
    TFL_API_URL: str =  "https://api.tfl.gov.uk/Line/Mode/tube/Status"
    TFL_API_KEY: SecretStr

settings = Settings()