import type { WeatherApiResponse, HttpValidationError } from "../client";
import { weatherApiWeatherGet} from "../client";
import {useEffect, useState} from "react";

export default function Weather() {
    const [data, setData] = useState<WeatherApiResponse | null>(null)
    const [error, setError] = useState<HttpValidationError | null>(null)

    useEffect(() => {
        async function getWeatherData() {
            const {data, error, response} = await weatherApiWeatherGet({
                "query": {
                    "latitude": 51.533300,
                    "longitude": 0.016670,
                    "daily": ["temperature_2m_max", "temperature_2m_min"],
                    "forecast_days": 1
                },
            })
            if (error) {
                setError(error)
            } else {
                setData(data)
            }
        }
        getWeatherData();
    }, [])

    if (!data) {
        return (
            <div className="border-dashed border-white border">
                <span>Loading...</span>
            </div>
        )
    }

    const maxTemperature: string = data?.daily?.temperature_2m_max?.at(0)
    const minTemperature: string = data?.daily?.temperature_2m_min?.at(0)
    
    return (
        <div className="border-dashed border-white border">
            <span>Max Temperature: {maxTemperature} </span>
            <span>Min Temperature: {minTemperature} </span>
        </div>
    )
}