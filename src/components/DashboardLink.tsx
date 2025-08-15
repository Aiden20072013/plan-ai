"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLink() {
    const path = usePathname();

    return (
        path !== "/dashboard" ? (
            <Link 
                href="/dashboard"
                className="border text-background border-background rounded px-1 bg-gray-900 dark:bg-gray-300 hover:opacity-90 transition-colors"
            >
                Dashboard
            </Link>
        ) : (
            <></>
        )
    )
}