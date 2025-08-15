import GoalLogs from "@/components/GoalLogs";
import { createClient, getUser } from "@/utils/supabase/server"
import { notFound, redirect } from "next/navigation";

export default async function GoalPage({ params: { id } }: { params: { id: string } }) {

    const supabase = await createClient();

    const user = await getUser();

    if (!user) redirect("/auth/login");

    const { data: goal } = await supabase
        .from("goals")
        .select("*")
        .eq("id", id)
        .single();

    if (!goal) return notFound();
    
    if (goal.user_id !== user.id) return notFound();

    return (
        <main className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Goal</h1>
                <div className="mt-8 grid gap-6">
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                        <p className="text-lg font-medium text-gray-900 dark:text-white">{goal.text}</p>
                    </div>
                    <GoalLogs user={user} goalId={goal.id} />
                </div>
            </div>
        </main>
    )
}