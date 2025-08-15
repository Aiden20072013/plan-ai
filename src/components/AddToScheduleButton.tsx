"use client";

import { useState } from "react";
import { Button } from "./ui/button";

export default function AddToScheduleButton() {

    const [loading, setLoading] = useState(false);

    async function handleClick() {
        setLoading(true);
        await fetch("/api/")
    }
    
    return (
        <Button onClick={handleClick}>{loading ? "Adding..." : "Add to Schedule"}</Button>
    )
}