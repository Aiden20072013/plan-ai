"use client";

import { usePathname } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel } from "./ui/dropdown-menu";
import Link from "next/link";

export default function NewLink() {
    const pathname = usePathname();

    return (
        pathname === "/dashboard" ? (
            <DropdownMenu>
                <DropdownMenuTrigger className="text-2xl">+</DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Create new...</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                        <Link href="/goals/create">Goal</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/schedule/create">Schedule</Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ) : (
            <></>
        )
    )
}