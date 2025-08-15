"use server";

import { Profile } from "@/types/db-types";
import { createClient, getProfile } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { cache } from "react";

export async function createGoal(text: string) {
    const supabase = await createClient();

    const profile = await getProfile();

    if (!profile) throw new Error("Unauthorized");

    const { data: _, error } = await supabase
        .from("goals")
        .insert([{
            text,
            user_id: profile.id
        }]);
    
    if (error) throw new Error(error.message);

    revalidatePath("/dashboard");
    revalidatePath("/schedule/create");
}

export const fetchGoals = cache(async (profile: Profile) => {
    const supabase = await createClient();

    const { data: goals } = await supabase
        .from("goals")
        .select("*")
        .eq("user_id", profile.id);

    return goals;
})

export async function fetchGoalLogs(goalId: string) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    const { data: goalLogs } = await supabase
        .from("goal_logs")
        .select("*")
        .eq("goal_id", goalId);
    
    return goalLogs;
}