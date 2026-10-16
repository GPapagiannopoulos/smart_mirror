import type {WeatherApiResponse, HttpValidationError, DailyMetrics, CurrentMetrics} from "../client";
import { weatherApiWeatherGet} from "../client";
import {useEffect, useState} from "react";
import {CloudDrizzle, Sun} from "lucide-react";
import {format} from "date-fns"

const dailyMetrics: Array<DailyMetrics> = [
    "temperature_2m_max",
    "temperature_2m_min",
    "sunrise",
    "sunset",
    "daylight_duration",
    "uv_index_max",
    "precipitation_sum"
]

const currentMetrics: Array<CurrentMetrics> = [
    "temperature_2m"
]

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
        if (!coordinates) {
            return;
        }

        const weatherApiRequestQuery = {
            "latitude": coordinates?.latitude,
            "longitude": coordinates?.longitude,
            "daily": dailyMetrics,
            "current": currentMetrics,
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

    function interpretUVIndex() {
        if (data?.daily?.uv_index_max == null) {
            return (
                <span>UV Index not Available</span>
            )
        }
        const uvIndex: number = data?.daily?.uv_index_max;
        let category: string;
        let sunIcon;
        let reminder: string;
        if (uvIndex <=2) {
            category = "Low";
            sunIcon = <Sun className="opacity-50"/>;
            reminder = "Good to go!";
        } else if (uvIndex <= 5) {
            category = "Moderate";
            sunIcon = <Sun className="opacity-70"/>;
            reminder = "Remember your sunscreen!";
        } else if (uvIndex <= 7) {
            category = "High";
            sunIcon = <Sun className="opacity-90"/>;
            reminder = "Remember your sunscreen!";
        } else if (uvIndex <= 10) {
            category = "Very High";
            sunIcon = <Sun className="opacity-100"/>;
            reminder = "Maybe stay inside?";
        } else {
            category = "Extreme";
            sunIcon = <Sun className="opacity-100 text-red-700"/>;
            reminder = "Stay home!";
        }

        return (
            <div>
                UV Index: {category} {sunIcon} <br/>
                {reminder}
            </div>
        )
    }

    function determineTemperature() {
        if (!data?.daily?.temperature_2m_min == null || !data?.daily?.temperature_2m_max == null) {
            return (
                <div>
                    Temperature data is missing!
                </div>
            )
        }
        return (
            <div>
                Today's temperature: {data?.daily?.temperature_2m_min} - {data?.daily?.temperature_2m_max} {data?.daily_units?.temperature_2m_max}
                Current temperature: {data?.current?.temperature_2m}
            </div>
        )
    }

    function interpretPrecipitation() {
        if (data?.daily?.precipitation_sum == null) {
            return (
                <div>Precipitation not available!</div>
            )
        }
        const totalPrecipitation: number = data?.daily?.precipitation_sum;
        let category: string;
        let icon;
        let reminder: string;
        if (totalPrecipitation <= 1) {
            category = "No Rain";
            icon = <CloudDrizzle className="opacity-0"/>;
            reminder = "Good to go!";
        } else if (totalPrecipitation <=4) {
            category = "Light Rain";
            icon = <CloudDrizzle className="opacity-50"/>;
            reminder = "Take an umbrella!";
        } else if (totalPrecipitation <= 6) {
            category = "Moderate Rain";
            icon = <CloudDrizzle className="opacity-50"/>;
            reminder = "Take an umbrella!";
        } else if (totalPrecipitation <= 20) {
            category = "Heavy Rain";
            icon = <CloudDrizzle className="opacity-90"/>;
            reminder = "Take an umbrella!";
        } else {
            category = "Thunderstorm";
            icon = <CloudDrizzle className="opacity-100 text-red-700"/>;
            reminder = "Stay home!";
        }

        return (
            <div>
                {category} {totalPrecipitation > 0 && icon} <br/>
                {reminder}
            </div>
        )
    }

    function determineSunrise() {
        if (data?.daily?.sunrise == null) {
            return (
                <div>Sunrise time unavailable!</div>
            )
        }

        return (
            <div>
                Sunrise {format(data?.daily?.sunrise, "pp")}
            </div>
        )
    }

    function determineSunset() {
        if (data?.daily?.sunset == null) {
            return (
                <div>Sunset time unavailable!</div>
            )
        }

        return (
            <div>
                Sunset {format(data?.daily?.sunset, "pp")}
            </div>
        )
    }
    return (
        <div className="border-dashed border-white border text-white">
            { determineTemperature() }
            { interpretUVIndex() }
            { interpretPrecipitation() }
            { determineSunrise() }
            { determineSunset() }
        </div>
    )
}