import { createClient, getUser } from "@/utils/supabase/server"
import { redirect } from "next/navigation";

export default async function GoalsPage() {

    const user = await getUser();

    if (!user) redirect("/auth/login");

    const supabase = await createClient();

    const { data: goals } = await supabase
        .from("goals")
        .select("*")
        .eq("user_id", user.id);

    return (
        <main className="p-3">
            {goals && goals.length > 0 ? (
                <div>
                    {goals.map(goal => (
                        <div key={goal.id}>{goal.text}</div>
                    ))}
                </div>
            ) : (
                <div>You have no goals to display</div>
            )}
        </main>
    )
}