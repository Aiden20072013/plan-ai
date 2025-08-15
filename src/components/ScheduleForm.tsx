"use client";

import { Goal } from "@/types/db-types";
import GoalListItem from "./GoalListItem";
import { useState, FormEvent } from "react";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ScheduleForm({ goals }: { goals: Goal[] }) {

    const [selectedList, setSelectedList] = useState(goals.map(goal => {
        return {
            id: goal.id,
            goalText: goal.text,
            selected: false
        }
    }));
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        try {
            setLoading(true);
            const genRes = await fetch("/api/schedule/generate-new", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                goals: selectedList.filter(item => item.selected === true),
                extraInfo: text
              })
            });

            if (!genRes.ok) {
                const { error } = await genRes.json();
                throw new Error(error);
            }

            const { data } = await genRes.json();

            const createRes = await fetch("/api/schedule/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    data,
                    goals: selectedList.filter(item => item.selected === true),
                    extraInfo: text
                })
            })

            if (!createRes.ok) {
                const { error } = await createRes.json();
                throw new Error(error);
            }

            router.push("/dashboard");
            
        } catch (err) {
            if (err instanceof Error) {
                toast(err.message);
            } else {
                toast("Error creating schedule");
            }
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="p-2 border rounded">
                <div>Choose goals to add to schedule</div>
                {goals.map(goal => (
                    <GoalListItem key={goal.id} goal={goal} selectedList={selectedList} setSelectedList={setSelectedList} />
                ))}
            </div>
            <div className="p-2 border rounded">
                <Label htmlFor="extra">Add extra details about schedule</Label>
                <Textarea 
                    id="extra"
                    placeholder="e.g. Rest days on sundays..."
                    value={text}
                    onChange={e => setText(e.target.value)}
                />
            </div>
            <Button disabled={loading}>{loading ? "Creating..." : "Create"}</Button>
        </form>
    )
}