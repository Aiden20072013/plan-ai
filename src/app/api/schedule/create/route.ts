import { getAuthenticatedUser } from "@/app/actions";
import { GenerateEvent, Goal } from "@/types/db-types";
import { createClient, getProfile } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const supabase = await createClient();

        if (!body.data) {
            return NextResponse.json({ error: "Events required" }, { status: 400 });
        }

        if (!body.goals) {
            return NextResponse.json({ error: "Goals required" }, { status: 400 });
        }

        // Check if user is authenticated
        const { data: { user } } = await getAuthenticatedUser(req);

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Create the schedule
        const { data: schedule, error } = await supabase
            .from("schedules")
            .insert([{
                user_id: user.id,
                extra_info: body.extraInfo
            }])
            .select("id")
            .single();
        
        if (error) {
            throw new Error(error.message);
        }

        // Create goal schedule record
        const goalScheduleJoins = body.goals.map((goal: Goal) => {
            return {
                goal_id: goal.id,
                schedule_id: schedule.id,
                user_id: user.id
            }
        })

        const { data: _, error: joinError } = await supabase
            .from("goal_schedule_join")
            .insert(goalScheduleJoins)
        
        if (joinError) {
            throw new Error(joinError.message);
        }

        const events = body.data.map((event: GenerateEvent) => {
            return {
                start_time: new Date(event.startTime),
                end_time: new Date(event.endTime),
                schedule_id: schedule.id,
                activity: event.activity,
                user_id: user.id,
                date: new Date(event.date),
                completed: false
            }
        })

        // Create events
        const { data: resEvents, error: eventError } = await supabase
            .from("events")
            .insert(events)
        
        if (eventError) {
            throw new Error(eventError.message);
        }

        // Make schedule id the main_schedule_id of user
        const { data, error: mainIdError } = await supabase
            .from("profiles")
            .update({ "main_schedule_id": schedule.id })
            .eq("id", user.id);
        
        if (mainIdError) {
            throw new Error(mainIdError.message);
        }
        
        return NextResponse.json({ message: "Success" });
    } catch (err) {
        if (err instanceof Error) {
            return NextResponse.json({ error: err.message }, { status: 500});
        } else if (typeof err === "string") {
            return NextResponse.json({ error: err }, { status: 500 });
        } else {
            return NextResponse.json({ error: "An error occurred" }, { status: 500 });
        }
    }
    
}