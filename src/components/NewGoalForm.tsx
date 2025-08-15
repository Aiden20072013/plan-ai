"use client";

import { createGoal } from "@/app/(content)/goals/actions";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export default function NewGoalForm() {

    const [loading, setLoading] = useState(false);
    const [goal, setGoal] = useState("");
    const router = useRouter();

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();

        try {
            setLoading(true);
            await createGoal(goal);
            router.push("/dashboard");
        } catch (err) {
            if (err instanceof Error) {
                toast(err.message);
            } else {
                toast.error("An error occurred");
            }
            setLoading(false);
        }
    }

    return (
        <form 
            onSubmit={handleSubmit}
            className="p-4 flex flex-col gap-2"
        >
            <Label htmlFor="goal" className="sr-only">Goal:</Label>
            <Textarea 
                placeholder="Goal or routine improvement..."
                value={goal}
                onChange={e => setGoal(e.target.value)}
            />
            <Button 
                type="submit"
                disabled={loading}
            >
                {loading ? "Adding..." : "Add goal"}
            </Button>
        </form>
    )
}