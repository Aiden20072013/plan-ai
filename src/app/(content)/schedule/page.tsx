import ScheduleContainer from "@/components/ScheduleContainer";
import { createClient, getUser } from "@/utils/supabase/server"
import { redirect } from "next/navigation";

export default async function SchedulesPage() {

    const user = await getUser();

    if (!user) redirect("/auth/login");

    const supabase = await createClient();

    const { data: schedules } = await supabase
        .from("schedules")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

    return (
        <main className="p-3 flex flex-col gap-4">
            {schedules && schedules.length > 0 ? (
                schedules.map((schedule, i) => (
                    <ScheduleContainer key={schedule.id} schedule={schedule} index={i} />
                ))
            ) : (
                <div>You have no schedules to display</div>
            )}
        </main>
    )
}