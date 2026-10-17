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


def _collapse_list(lst: list[str]) -> str:
    return ",".join(lst)

@router.get("/weather",
         response_model=WeatherAPIResponse,
         tags=["weather"]
         )
async def weather(request_body: Annotated[WeatherAPIRequest, Query()]):
    params = request_body.model_dump()

    params["daily"] = _collapse_list(params["daily"])
    params["current"] = _collapse_list(params["current"])

    async with httpx.AsyncClient() as client:
        response = await client.get(settings.WEATHER_API_URL, params=params)

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.json())

    clean_response = response.json()

    time_fields = ["daily", "current", "daily_units"]
    for key in time_fields:
        clean_response[key].pop("time")
    for key in clean_response["daily"].keys():
        clean_response["daily"][key] = next(iter(clean_response["daily"][key]))

    return WeatherAPIResponse.model_validate(clean_response)

app.include_router(router)