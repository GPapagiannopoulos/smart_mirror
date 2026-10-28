import './App.css'
import Weather from "./components/Weather.tsx";
import Clock from "./components/Clock.tsx";
import {useEffect, useState} from "react";
import {
    type CurrentMetrics,
    type DailyMetrics,
    type HttpValidationError,
    type WeatherApiResponse,
    weatherApiWeatherGet
} from "./client";
import Transport from "./components/Transport.tsx";

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

function App() {
    const [data, setData] = useState<WeatherApiResponse | null>(null)
    const [validationError, setError] = useState<HttpValidationError | null>(null)
    const [coordinates, setCoordinates] = useState<GeolocationCoordinates | null>(null)

    useEffect(() => {
        async function determineLocation(): Promise<void> {
            const options = {enableHighAccuracy: true, timeout: 10000}

            function success(pos: any) {
                setCoordinates(pos.coords);
            }

            function error(err: any) {
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
            const {data, error} = await weatherApiWeatherGet({
                "query": weatherApiRequestQuery
            })
            if (error) {
                setError(error);
                console.log(validationError);
            } else {
                setData(data);
            }
        }
        getWeatherData();
    }, [coordinates])

  return (
      <div className="bg-black w-auto h-screen flex flex-col p-12 gap-10">
          <Clock sunset={data?.daily?.sunset} sunrise={data?.daily?.sunrise}/>
          <Weather data={data}/>
          <Transport />
      </div>


  )
}

export default App
