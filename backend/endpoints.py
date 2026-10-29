from typing import Annotated

from fastapi import FastAPI, HTTPException, Query, APIRouter

import logging
import httpx

from .models import WeatherAPIResponse, WeatherAPIRequest, TflAPIResponse, TfLAPILine, TfLAPIDisruptedLineInfo
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

def _convert_severity_scale(severity: int | None) -> int:
    if severity is None:
        return 10
    return (severity - 10) * (-1)

@router.get(
    "/transport",
    response_model=TflAPIResponse,
    tags=["transport"]
)
async def transport():
    async with httpx.AsyncClient() as client:
        response = await client.get(settings.TFL_API_URL,params={"app_key": settings.TFL_API_KEY.get_secret_value(),})

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.text)
    lines: list[TfLAPILine] = [TfLAPILine.model_validate(line) for line in response.json()]
    if len(lines) == 0:
        raise ValueError("Request returned no lines statuses.")

    disrupted_lines: list[TfLAPIDisruptedLineInfo] = []
    for line in lines:
        if len(line.lineStatuses) == 1:
            status = next(iter(line.lineStatuses))
            converted_severity = _convert_severity_scale(status.statusSeverity)
            if status.lineId is None or status.statusSeverity == 10:
                continue
            disrupted_lines.append(TfLAPIDisruptedLineInfo(name=status.lineId.capitalize(), severity=converted_severity, reason=status.reason))
        else:
            most_severe_status = TfLAPIDisruptedLineInfo(severity=0)
            for status in line.lineStatuses:
                if _convert_severity_scale(status.statusSeverity) > most_severe_status.severity and status.lineId is not None:
                    most_severe_status = TfLAPIDisruptedLineInfo(name=status.lineId, severity=_convert_severity_scale(status.statusSeverity), reason=status.reason, multipleDisruptions=True)
            disrupted_lines.append(most_severe_status)

    logger.debug(disrupted_lines)
    return TflAPIResponse.model_validate({"lines": disrupted_lines})

app.include_router(router)