import ForbiddenPage from "@/components/ForbiddenPage";
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation";

export default async function EditSchedule({ params: { id } }: { params: { id: string } }) {

    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/auth/login");

    const { data: schedule } = await supabase
        .from("schedules")
        .select("*")
        .eq("id", id)
        .single();

    if (schedule.user_id !== user.id) {
        return <ForbiddenPage />
    }

    const { data: events } = await supabase
        .from("events")
        .select("*")
        .eq("schedule_id", schedule.id)
        .order("start_time", { ascending: true });
    
    if (!events || events.length === 0) {
        return (
            <main className="p-3">
                <div>This schedule has no events</div>
            </main>
        )
    }

    return (
        <main className="p-3">
            
        </main>
    )
}