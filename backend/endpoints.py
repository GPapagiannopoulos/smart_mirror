import openmeteo_requests
import requests_cache
from retry_requests import retry
from fastapi import FastAPI
import logging
import json
import httpx

from .models import WeatherAPIResponse, WeatherAPIRequest
from .settings import settings

logger = logging.getLogger("uvicorn.error")
logger.setLevel(logging.DEBUG)

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello, World!"}

@app.post("/weather",
         response_model=WeatherAPIResponse
         )
async def weather(request_body: WeatherAPIRequest):
    params = request_body.model_dump()

    new_daily = [param.value for param in params["daily"]]
    params["daily"] = ",".join(new_daily)

    async with httpx.AsyncClient() as client:
        response = await client.get(settings.WEATHER_API_URL, params=params)

    logger.debug(response.json())

    clean_response = response.json()
    clean_response["daily"].pop("time")
    clean_response["daily_units"].pop("time")
    logger.debug(clean_response)

    return WeatherAPIResponse.model_validate(clean_response)