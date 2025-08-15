import { getProfile } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { fetchGoals } from "../../goals/actions";
import ScheduleForm from "@/components/ScheduleForm";

export default async function CreateSchedulePage() {

    const profile = await getProfile();

    if (!profile) redirect("/auth/login");

    const goals = await fetchGoals(profile);

    if (!goals || goals.length === 0) {
        redirect("/goals/create");
    }

    return (
        <main>
            <h3>Create a Schedule</h3>
            <ScheduleForm goals={goals} />
        </main>
    )
}