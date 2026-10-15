from typing import Annotated

from fastapi import FastAPI, HTTPException, Query, APIRouter

import logging
import httpx

from .models import WeatherAPIResponse, WeatherAPIRequest
from .settings import settings

logger = logging.getLogger("uvicorn.error")
logger.setLevel(logging.DEBUG)

app = FastAPI()
router = APIRouter(prefix="/api")

@router.get("/")
async def root():
    return {"message": "Hello, World!"}

@router.get("/weather",
         response_model=WeatherAPIResponse,
         tags=["weather"]
         )
async def weather(request_body: Annotated[WeatherAPIRequest, Query()]):
    params = request_body.model_dump()

    new_daily = [param.value for param in params["daily"]]
    params["daily"] = ",".join(new_daily)

    async with httpx.AsyncClient() as client:
        response = await client.get(settings.WEATHER_API_URL, params=params)

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.json())

    clean_response = response.json()
    clean_response["daily"].pop("time")
    clean_response["daily_units"].pop("time")

    return WeatherAPIResponse.model_validate(clean_response)

app.include_router(router)