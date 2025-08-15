"use client"

import { useTheme } from "next-themes"
import { DropdownMenuItem, DropdownMenuLabel } from "./ui/dropdown-menu"

export default function ThemeMenuItem() {

    const { theme, setTheme } = useTheme();

    return (
        <>
            <DropdownMenuLabel>Theme</DropdownMenuLabel>
            <DropdownMenuItem 
                onClick={() => setTheme("light")}
                className={theme === "light" ? "bg-muted" : ""}
            >
                Light
            </DropdownMenuItem>
            <DropdownMenuItem
                onClick={() => setTheme("dark")}
                className={theme === "dark" ? "bg-muted" : ""}
            >
                Dark
            </DropdownMenuItem>
            <DropdownMenuItem
                onClick={() => setTheme("system")}
                className={theme === "system" ? "bg-muted" : ""}
            >
                System
            </DropdownMenuItem>
        </>
    )
}