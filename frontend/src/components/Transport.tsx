import {useEffect, useState} from "react";
import {type HttpValidationError, type TflApiResponse, transportApiTransportGet} from "../client";

const MINUTES_PER_REFRESH: number = 5;

interface disruptedServiceProps {
    line: string;
    severity: number;
    reason: string;
}
function DisruptedServicePanel({ line, severity, reason} : disruptedServiceProps) {
    return (
        <div>{line} {severity} {reason}</div>
    )
}

export default function Transport() {
    const [response, setResponse] = useState<TflApiResponse | null | undefined>(null)
    const [error, setError] = useState<HttpValidationError | null>(null)

    async function getUpdates(): Promise<void> {
            const {data, error} = await transportApiTransportGet();
            if (error) {
                setError(error);
            } else {
                setResponse(data);
            }
        }

    useEffect(() => {
        getUpdates();

        const id = setInterval(() => {
            getUpdates();
        }, 1000 * 60 * MINUTES_PER_REFRESH)
        return () => {
            clearInterval(id);
        }
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
            {response?.lines?.map((line) => {
                const status = line.lineStatuses;
                if (status) {
                    const disruption: disruptedServiceProps = {
                        line: status.at(0)?.lineId,
                        severity: status.at(0)?.statusSeverity,
                        reason: status.at(0)?.reason
                    }
                    return DisruptedServicePanel(disruption);
                }
            })
            }
        </div>
    )
}