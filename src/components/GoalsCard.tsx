import { Profile } from "@/types/db-types";
import Link from "next/link";
import { fetchGoals } from "@/app/(content)/goals/actions";
import GoalCard from "./GoalCard";

export default async function GoalsCard({ profile }: { profile: Profile }) {

    const goals = await fetchGoals(profile);

    return (
        <div className="p-4 bg-card rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">My Goals</h3>
            {goals && goals.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-4">
                {goals.map(goal => (
                    <GoalCard key={goal.id} goal={goal} />
                ))}
                </div>
            ) : (
                <div className="text-center mt-4">
                    <p className="text-base text-gray-500 dark:text-gray-400">You have no goals to display.</p>
                    <Link href="/goals/create" className="mt-2 inline-block text-indigo-600 hover:text-indigo-500">
                        Create a goal
                    </Link>
                </div>
            )}
        </div>
    )
}