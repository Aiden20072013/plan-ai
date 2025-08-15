"use client";

import { updateChecked } from "@/app/actions";
import { formatDate, formatDay, formatTime } from "@/lib/formatters";
import { DbEvent } from "@/types/db-types";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function EventCard({ event }: { event: DbEvent }) {

    const pathname = usePathname();

    const [completed, setCompleted] = useState(event.completed);

    async function handleCheck() {
        try {
            setCompleted(prev => !prev);
            await updateChecked(event);
        } catch (err) {
            setCompleted(prev => !prev);
        }
    }

    return (
        <div className="flex w-full justify-between border rounded p-2 my-2 bg-background">
            <div>
                <div>
                    <div className="font-semibold">{formatDay(new Date(event.date))}</div>
                    <div className="text-sm opacity-80">{formatDate(new Date(event.date))}</div>
                </div>
                <div>{event.activity}</div>
                <div>{formatTime(new Date(event.start_time))} - {formatTime(new Date(event.end_time))}</div>
            </div>
            <div>
                {pathname === "/dashboard" && (
                    <input
                        type="checkbox"
                        checked={completed ?? false}
                        onChange={handleCheck}
                    />
                )}
            </div>
        </div>
    )
}