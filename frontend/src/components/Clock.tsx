import {useEffect, useState} from "react";
import {format} from "date-fns";

export default function Clock() {
    const [time, setTime] = useState<string | null>(null)

    useEffect(() => {
        setInterval(() => {
            const datetime = new Date();
            setTime(format(datetime.toISOString(), "PPp"))
        }, 1000)
    }, [])

    return (
        <div>{time}</div>
    )
}