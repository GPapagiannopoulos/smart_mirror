import type {WeatherApiResponse} from "../client";
import {CloudDrizzle, Sun, SunriseIcon, SunsetIcon, ThermometerIcon} from "lucide-react";
import {format} from "date-fns"

export default function Weather({ data } : {data: WeatherApiResponse} ) {
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
                <span className={"flex gap-4 justify-end"}>
                     {sunIcon} UV Index:{category}
                </span>
                <span className={"flex justify-end"}>
                    {reminder}
                </span>

            </div>
        )
    }

    function determineTemperature() {
        if (data?.daily?.temperature_2m_min == null || data?.daily?.temperature_2m_max == null) {
            return (
                <div>
                    Temperature data is missing!
                </div>
            )
        }

        const maxTemp: number = data?.daily?.temperature_2m_max;
        const minTemp: number = data?.daily?.temperature_2m_min;
        const currTemp: number = data?.current?.temperature_2m;
        const celsius: string = data?.daily_units?.temperature_2m_max;

        return (
            <div>
                <span className={"flex gap-4"}>
                    <ThermometerIcon /> {currTemp}{celsius}
                </span>
                <span className={"flex ml-10"}>
                    {minTemp}{celsius} - {maxTemp}{celsius}
                </span>
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
            icon = <Sun className="opacity-100"/>;
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
                <span  className={"flex justify-end gap-4"}>
                    {icon} {category}
                </span>
                <span className={"flex justify-end"}>
                    {reminder}
                </span>
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
                <span className={"flex gap-4"}>
                    <SunriseIcon /> {format(data?.daily?.sunrise, "pp")}
                </span>
            </div>
        )
    }

    function determineSunset() {
        if (data?.daily?.sunset == null) {
            return (
                <div>
                    Sunset time unavailable!
                </div>
            )
        }
        return (
            <div>
                <span className={"flex gap-4"}>
                    <SunsetIcon /> {format(data?.daily?.sunset, "pp")}
                </span>

            </div>
        )
    }
    return (
        <div className={"font-mono font-semibold text-white flex flex-col gap-4"}>
            <div className={"grid grid-cols-2"}>
                { determineTemperature() }
                { interpretPrecipitation() }
            </div>
            <div className={"grid grid-cols-2"}>
                <div className={"flex flex-col gap-2"}>
                    { determineSunrise() }
                    { determineSunset() }
                </div>
                { interpretUVIndex() }
            </div>

        </div>
    )
}