import { Schedule } from "@/types/db-types";
import { createClient } from "@/utils/supabase/server";
import EventCard from "./EventCard";
import { Button } from "./ui/button";
import Link from "next/link";
import { Pencil } from "lucide-react";

export default async function ScheduleContainer({ schedule, index }: { schedule: Schedule, index: number }) {

    const supabase = await createClient();

    const { data: events } = await supabase
        .from("events")
        .select("*")
        .eq("schedule_id", schedule.id)
        .order("start_time", { ascending: true });
    
    if (!events || events.length === 0) {
        return <></>
    }

    return (
        <div className="border rounded-md m-4 p-3 bg-card shadow shadow-muted">
            <div className="flex justify-between">
                <div>Schedule {index + 1}</div>
                <Button asChild>
                    <Link href={`/schedule/edit/${schedule.id}`}>
                        <Pencil />
                    </Link>
                </Button>
            </div>
            {events.map(event => (
                <EventCard key={event} event={event} />
            ))}
        </div>
    )
}