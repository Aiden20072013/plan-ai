import { getUser } from "@/utils/supabase/server"
import Link from "next/link";
import UserIcon from "./UserIcon";
import DashboardLink from "./DashboardLink";
import NewLink from "./NewLink";
import NavIcon from "./NavIcon";

export default async function Header() {

    const user = await getUser();

    return (
        <header className="flex justify-between items-center p-4 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-950 border-b">
            <div className="flex gap-4 items-center text-center">
                <NavIcon />
                <Link href="/" className="text-2xl font-bold text-indigo-600">PlanAI</Link>
            </div>
            {user ? (
                <div className="flex items-center gap-4">
                    <DashboardLink />
                    <NewLink />
                    <UserIcon />
                </div>
            ) : (
                <Link href="/auth/login">Log In</Link>
            )}
        </header>
    )
}