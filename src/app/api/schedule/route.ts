import { createClient, getProfile } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const supabase = await createClient();

        const profile = await getProfile();

        if (!profile) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!profile.main_schedule_id) {
            return NextResponse.json({ events: [], expired: false });
        }

        const { data: events, error } = await supabase
            .from("events")
            .select("*")
            .eq("schedule_id", profile.main_schedule_id)
            .order("start_time", { ascending: false })
            .limit(16);

        if (error) {
            throw new Error(error.message);
        }

        events.reverse();

        if (events && new Date(events[events.length - 1].date).getTime() < Date.now()) {
            return NextResponse.json({ events, expired: true });
        } else {
            return NextResponse.json({ events, expired: false });
        }
    } catch (err) {
        if (err instanceof Error) {
            return NextResponse.json({ error: err.message }, { status: 500 });
        } else if (typeof err === "string") {
            return NextResponse.json({ error: err }, { status: 500 });
        } else {
            return NextResponse.json({ error: "An error occurred" }, { status: 500 });
        }
    }
    
}