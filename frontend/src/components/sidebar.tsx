"use client"
import useSidebarState from "@/hooks/useSidebarState";
import React, { createContext, useContext, useEffect } from "react";


export const sidebarContext = createContext(false);

export default function Sidebar() {
    const [isSidebarOpen, setIsSidebarOpen] = useSidebarState()

    useEffect(() => {
        console.log(isSidebarOpen);
    })

    const isOpen = isSidebarOpen ? "w-0" : "w-40"
    return (
        <div className={"fixed box-border bg-neutral-100 dark:bg-darkNeutral-100 min-h-screen border-solid border-2 border-neutral-300 dark:border-darkNeutral-300 flex justify-center content-between " + isOpen}>
            <div>

            </div>
            <div>

            </div>
        </div>
    );
}
