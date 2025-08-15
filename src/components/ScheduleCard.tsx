"use client";

import { DbEvent, Profile } from "@/types/db-types";
import Link from "next/link";
import { useEffect, useState } from "react";
import EventCard from "./EventCard";

export default function ScheduleCard({ profile }: { profile: Profile }) {

    const [loading, setLoading] = useState(true);
    const [schedule, setSchedule] = useState<DbEvent[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchSchedule() {
            try {
                const res = await fetch("/api/schedule");
                if (!res.ok) {
                    const { error } = await res.json();
                    throw new Error(error);
                }

                const result = await res.json();

                if (result.expired) {
                    const res = await fetch(`/api/schedule/update`, {
                        method: "POST",
                        body: JSON.stringify({ events: result.events, schedule_id: profile.main_schedule_id })
                    });
        
                    if (!res.ok) {
                        const { error } = await res.json();
                        throw new Error(error);
                    }
        
                    const newEvents = await res.json();

                    setSchedule(newEvents);
                } else {
                    setSchedule(result.events);
                }
                
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Error fetching schedule");
                }
            } finally {
                setLoading(false);
            }
        }

        fetchSchedule();
    }, []);

    if (error) {
        return (
            <div>
                <div>Error</div>
                <div>{error}</div>
            </div>
        )
    }

    return (
        <div className="p-4 bg-card rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">My Schedule</h3>
            {loading ? (
                    <div className="text-center mt-4">Loading...</div>
                ) : schedule && schedule.length > 0 ? (
                    <div className="mt-4 grid gap-4">
                        {schedule.map(event => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center mt-4">
                        <p className="text-base text-gray-500 dark:text-gray-400">You have no schedule to display.</p>
                        <Link href="/schedule/create" className="mt-2 inline-block text-indigo-600 hover:text-indigo-500">
                            Create Schedule
                        </Link>
                    </div>
                )
            }
        </div>
    )
}