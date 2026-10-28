import {useEffect, useState} from "react";
import {type HttpValidationError, type TflApiResponse, transportApiTransportGet} from "../client";

export default function Transport() {
    const [message, setMessage] = useState<TflApiResponse | null>(null)
    const [error, setError] = useState<HttpValidationError | null>(null)

    useEffect(() => {
        async function getUpdates(): Promise<void> {
            const {data, error} = await transportApiTransportGet();

            if (error) {
                setError(error);
            } else {
                setMessage(data);
            }
        }
        getUpdates();
    }, [])

    if (error) {
        return (
            <div>
                The page failed to load!
            </div>
        )
    }
    return (
        <div>
            <pre>{JSON.stringify(message, null, 2)}</pre>
        </div>
    )
}