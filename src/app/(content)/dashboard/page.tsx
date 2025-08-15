import GoalsCard from "@/components/GoalsCard";
import ScheduleCard from "@/components/ScheduleCard";
import { getProfile } from "@/utils/supabase/server"
import { redirect } from "next/navigation";

export default async function Dashboard() {
    const profile = await getProfile();

    if (!profile) redirect("/auth/login");

    return (
        <main className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Dashboard</h1>
                <div className="mt-8 flex flex-col gap-6">
                    <GoalsCard profile={profile} />
                    <ScheduleCard profile={profile} />
                </div>
            </div>
        </main>
    )
}