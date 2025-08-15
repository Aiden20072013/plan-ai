import NewGoalForm from "@/components/NewGoalForm";
import { getUser } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function CreateGoalsPage() {
    const user = await getUser();

    if (!user) redirect("/auth/login");

    return (
        <NewGoalForm />
    )
}