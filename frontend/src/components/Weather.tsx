import type { WeatherApiResponse, HttpValidationError } from "../client";
import { weatherApiWeatherGet} from "../client";
import {useEffect, useState} from "react";

export default function Weather() {
    const [data, setData] = useState<WeatherApiResponse | null>(null)
    const [error, setError] = useState<HttpValidationError | null>(null)
    const [coordinates, setCoordinates] = useState<GeolocationCoordinates | null>(null)


    useEffect(() => {
        async function determineLocation(): Promise<void> {
            const options = {enableHighAccuracy: true, timeout: 10000}

            function success(pos) {
                setCoordinates(pos.coords);
            }

            function error(err) {
                console.warn(`ERROR(${err.code}): ${err.message}`);
            }

            navigator.geolocation.getCurrentPosition(success, error, options);
        }
        determineLocation();
    }, [])

    useEffect(() => {
        const weatherApiRequestQuery = {
            "latitude": coordinates?.latitude,
            "longitude": coordinates?.longitude,
            "daily": ["temperature_2m_max", "temperature_2m_min"],
            "forecast_days": 1
                }

        async function getWeatherData() {
            const {data, error, response} = await weatherApiWeatherGet({
                "query": weatherApiRequestQuery
            })
            if (error) {
                setError(error)
            } else {
                setData(data)
            }
        }
        getWeatherData();
    }, [coordinates])

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