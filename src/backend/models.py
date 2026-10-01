from pydantic import BaseModel, Field
from enum import Enum

class Coordinates(BaseModel):
    latitude: float | int = Field(ge=-180.0, le=180.0)
    longitude: float | int = Field(ge=-180.0, le=180.0)

class City(BaseModel):
    coordinates: Coordinates
    name: str | None

class DailyMetrics(str, Enum):
    """Valid daily metrics to query API for"""
    max_temperature = "temperature_2m_max"
    min_temperature = "temperature_2m_min"
    sunrise = "sunrise"
    sunset = "sunset"
    daylight_duration = "daylight_duration"
    uv_max_index = "uv_max_index"
    precipitation = "precipitation_sum"

class WeatherAPIRequest(BaseModel):
    """Data model for weather API request body"""
    coordinates: Coordinates
    daily: list[DailyMetrics] = Field(default_factory=list)
    forecast_duration: int = Field(ge=1, default=1)

class WeatherAPIResponse(BaseModel):
    coordinates: Coordinates
    elevation: float
    generation_time_ms: float
    utc_offset_seconds: int
    timezone: str
    timezone_abbreviation: str
    daily: dict[DailyMetrics, list] = Field(default_factory=dict)
    daily_units: dict[DailyMetrics, str] = Field(default_factory=dict)


