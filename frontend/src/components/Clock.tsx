import {useEffect, useState} from "react";
import {type LucideIcon, MoonStar, SunMediumIcon} from "lucide-react";
import {format, isAfter} from "date-fns"

const daysOfTheWeek: Array<string> = [
    "Sunday", "Monday", "Tuesday", "Wednesday",
    "Thursday", "Friday", "Saturday",
]
const monthsOfTheYear: Array<string> = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
]

export default function Clock( {sunset} : {sunset:string | null} ) {
    const [date, setDate] = useState<string | null>(null);
    const [time, setTime] = useState<string | null>(null);

    useEffect(() => {
        const id = setInterval(() => {
            const datetime = new Date();

            const day: string = format(datetime, 'EEEE');
            const date: string = format(datetime, 'do');
            const month: string = format(datetime, 'MMMM');
            const hours: string = format(datetime, 'HH');
            const minutes: string = format(datetime, 'mm');

            setDate(`${day} ${date}, ${month}`);
            setTime(`${hours}:${minutes}`);
        }, 1000)

        return () => {
            clearInterval(id);
        }
    }, [])

    return (
        <div className="flex items-center gap-4">
            { isAfter(new Date(), new Date(sunset? sunset : "")) ? <MoonStar size={"64"}/> : <SunMediumIcon size={"64"}/> }
            <div className={"flex flex-col items-start gap-4 font-mono font-bold text-2xl text-white"}>
                <span>{date}</span> <span>{time}</span>
            </div>
        </div>
    )
}