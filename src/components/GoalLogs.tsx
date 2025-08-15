"use client";

import { fetchGoalLogs } from "@/app/(content)/goals/actions";
import { GoalLog } from "@/types/db-types";
import { FormEvent, useEffect, useState } from "react";
import { Textarea } from "./ui/textarea";
import { User } from "@supabase/supabase-js";
import { addGoalLog } from "@/app/actions";
import { formatLogDate } from "@/lib/formatters";
import { Button } from "./ui/button";

export default function GoalLogs({ goalId, user }: { goalId: string, user: User }) {
    const [loading, setLoading] = useState(true);
    const [goalLogs, setGoalLogs] = useState<GoalLog[]>([]);
    const [newLog, setNewLog] = useState("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function getGoalLogs() {
            try {
                setLoading(true);
                const result = await fetchGoalLogs(goalId);

                if (result && result.length > 0) {
                    setGoalLogs(result);
                }
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("An error occurred");
                }
            } finally {
                setLoading(false);
            }
        }

        getGoalLogs();
    }, [goalId]);

    async function postGoalLog(e: FormEvent) {

        e.preventDefault();

        if (newLog.length === 0) {
            return;
        }

        try {
            const placeholderLog = newLog;
            setGoalLogs(prev => {
                return [...prev, {
                    id: "temporary",
                    text: newLog,
                    created_at: new Date(),
                    user_id: user.id,
                    goal_id: goalId
                }]
            })

            setNewLog("");

            const  dbLog = await addGoalLog(placeholderLog, goalId);

            setGoalLogs(prev => prev.map(item => {
                if (item.id === "temporary") {
                    return {
                        id: dbLog.id,
                        created_at: dbLog.created_at,
                        text: dbLog.text,
                        user_id: dbLog.user_id,
                        goal_id: dbLog.goal_id
                    }
                } else {
                    return item;
                }
            }))
        } catch (err) {
            if (err instanceof Error) {
               setError(err.message);
            } else {
                setError("An error occurred getting logs.");
            }
        }
    }

    if (loading) {
        return (
            <div className="p-4 bg-card rounded-lg shadow-md text-center">
                <p className="text-gray-500 dark:text-gray-400">Loading...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg shadow-md text-center">
                <p>{error}</p>
            </div>
        )
    }

    return (
        <div className="p-4 bg-card rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Goal Logs</h3>
            <div className="space-y-4">
                {goalLogs && goalLogs.length > 0 ? (
                    goalLogs.map(goalLog => (
                        <GoalLogCard key={goalLog.id} goalLog={goalLog} />
                    )) 
                ) : (
                    <div className="text-center text-gray-500 dark:text-gray-400">You have no goal logs to display.</div>
                )}
            </div>
            <form onSubmit={postGoalLog} className="mt-6">
                <Textarea
                    placeholder="New milestone or achievement"
                    value={newLog}
                    onChange={e => setNewLog(e.target.value)}
                    className="mb-2"
                />
                <Button type="submit">Post</Button>
            </form>
        </div>
    )
}

function GoalLogCard({ goalLog }: { goalLog: GoalLog }) {
    return (
        <div className="p-3 border rounded-lg bg-background">
            <div className="text-sm text-muted-foreground mb-1">{formatLogDate(new Date(goalLog.created_at))}</div>
            <p>{goalLog.text}</p>
        </div>
    )
}
