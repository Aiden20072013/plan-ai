import Image from "next/image";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { getProfile } from "@/utils/supabase/server";
import Link from "next/link";
import ThemeMenuItem from "./ThemeMenuItem";

export default async function UserIcon() {

    const profile = await getProfile();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Image
                    src={profile.avatar_url || "/default-profile.jpg"}
                    alt="User"
                    height={35}
                    width={35}
                    className="rounded-full"
                />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem asChild>
                    <Link href="/account">Account</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <ThemeMenuItem />
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <SignOut />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

function SignOut() {
    return (
        <form action="/auth/signout" method="POST">
            <button>Sign Out</button>
        </form>
    )
}