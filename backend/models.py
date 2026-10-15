"""Data models for API requests and responses"""
import string

from pydantic import BaseModel, Field
from enum import Enum

class DailyMetrics(str, Enum):
    """Valid daily metrics to query API for"""
    max_temperature = "temperature_2m_max"
    min_temperature = "temperature_2m_min"
    sunrise = "sunrise"
    sunset = "sunset"
    daylight_duration = "daylight_duration"
    uv_index_max = "uv_index_max"
    precipitation = "precipitation_sum"

class WeatherAPIRequest(BaseModel):
    """Data model for weather API request body"""
    latitude: float | int = Field(ge=-180.0, le=180.0)
    longitude: float | int = Field(ge=-180.0, le=180.0)
    daily: list[DailyMetrics] = Field(default_factory=list)
    forecast_days: int = Field(ge=1, default=1)

class WeatherAPIResponse(BaseModel):
    """Data model for weather API response body"""
    latitude: float | int = Field(ge=-180.0, le=180.0)
    longitude: float | int = Field(ge=-180.0, le=180.0)
    elevation: float
    generationtime_ms: float
    utc_offset_seconds: int
    timezone: str
    timezone_abbreviation: str
    daily: dict[DailyMetrics, list[float | int]] = Field(default_factory=dict)
    daily_units: dict[DailyMetrics, str] = Field(default_factory=dict)


