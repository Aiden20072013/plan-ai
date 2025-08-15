import { AlignJustify } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import Link from "next/link";

export default function NavIcon() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <AlignJustify />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem asChild>
                    <Link href="/schedule">My Schedules</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/goals">My Goals</Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}