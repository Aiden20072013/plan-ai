"use client";

import { Goal } from "@/types/db-types";
import { Dispatch, SetStateAction, useState } from "react";

type SelectedListType = {
    id: string,
    goalText: string,
    selected: boolean,
}

export default function GoalListItem({ goal, setSelectedList }: { goal: Goal, selectedList: SelectedListType[], setSelectedList: Dispatch<SetStateAction<{
    id: string;
    goalText: string;
    selected: boolean;
}[]>> }) {

    const [itemSelected, setItemSelected] = useState(false);

    function selectItem() {
        setItemSelected(prev => !prev);
        setSelectedList(prev => prev.map(item => {
            if (item.id === goal.id) {
                return { ...item, selected: !item.selected}
            } else {
                return item;
            }
        }))
    }

    return (
        <div 
            className={`p-2 border border-gray-500 rounded ${itemSelected === true ? "bg-muted" : ""}`}
            onClick={selectItem}
        >
            {goal.text}
        </div>
    )
}