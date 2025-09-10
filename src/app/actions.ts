"use server";

import { DbEvent } from "@/types/db-types";
import { createClient, getProfile, getUser } from "@/utils/supabase/server";
import { SupabaseClient, User } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

export async function updateChecked(event: DbEvent) {
    const profile = await getProfile();
    const supabase = await createClient();

    if (!profile) {
        throw new Error("Unauthorized");
    }

    const { data: _, error } = await supabase
        .from("events")
        .update({ "completed": !event.completed })
        .eq("id", event.id);
    
    if (error) {
        throw new Error(error.message);
    }
}

export async function addGoalLog(text: string, goal_id: string) {
    const user = await getUser();
    
    if (!user) {
        throw new Error("Unauthorized");
    }

    const supabase = await createClient();

    const { data: log, error } = await supabase
        .from("goal_logs")
        .insert({
            text,
            user_id: user.id,
            goal_id 
        })
        .select("*")
        .single();
    
    if (error) {
        throw new Error(error.message);
    }

    return log;
}

export async function getAuthenticatedUser(req: NextRequest): Promise<[SupabaseClient, User | null]> {
    const authHeader = req.headers.get("Authorization");

    if (authHeader?.startsWith("Bearer ")) {

        const accessToken = authHeader.replace("Bearer ", "");
        const refreshToken = req.headers.get("X-Refresh-Token");
        const supabase = await createClient();

        await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken ?? ""
        })

        const { data: { user } } = await supabase.auth.getUser();

        return [supabase, user];
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return [supabase, user];
}