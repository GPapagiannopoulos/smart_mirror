"""Data models for API requests and responses"""
from datetime import datetime
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

class DailyData(BaseModel):
    """Expected dtypes for each metric returned."""
    temperature_2m_max: float | int | None = None
    temperature_2m_min: float | int | None = None
    sunrise: datetime | None = None
    sunset: datetime | None = None
    daylight_duration: float | int | None = None
    uv_index_max: float | int | None = None
    precipitation_sum: float | int | None = None

class CurrentMetrics(str, Enum):
    """Valid current metrics to query API for"""
    temperature_2m = "temperature_2m"

class CurrentData(BaseModel):
    """Expected dtypes for each metric returned."""
    temperature_2m: float | int | None = None

class WeatherAPIRequest(BaseModel):
    """Data model for weather API request body"""
    latitude: float | int = Field(ge=-180.0, le=180.0)
    longitude: float | int = Field(ge=-180.0, le=180.0)
    daily: list[DailyMetrics] = Field(default_factory=list)
    current: list[CurrentMetrics] = Field(default_factory=list)
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
    daily: DailyData = Field(default_factory=dict)
    daily_units: dict[DailyMetrics, str] = Field(default_factory=dict)
    current: CurrentData = Field(default_factory=dict)


