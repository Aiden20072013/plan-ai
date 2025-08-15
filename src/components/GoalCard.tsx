import { Goal } from "@/types/db-types";
import Link from "next/link";

export default function GoalCard({ goal }: { goal: Goal }) {
    return (
        <div className="p-2 rounded shadow border bg-background">
            <div>
                <Link href={`/goals/${goal.id}`}>{goal.text}</Link>
            </div>
        </div>
    )
}