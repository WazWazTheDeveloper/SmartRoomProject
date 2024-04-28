"use client"
import useSidebarState from "@/hooks/useSidebarState";
import Link from "next/link";
import React, { createContext, useContext, useEffect } from "react";
import { DevicesOther } from '@mui/icons-material';

export const sidebarContext = createContext(false);

export default function Sidebar() {
    const [isSidebarOpen, setIsSidebarOpen] = useSidebarState()

    useEffect(() => {
        console.log(isSidebarOpen);
    })

    const isOpen = isSidebarOpen ? "w-0" : "w-40"
    return (
        <div className={"fixed box-border bg-neutral-100 dark:bg-darkNeutral-100 min-h-screen border-solid border-2 border-neutral-300 dark:border-darkNeutral-300 flex justify-center content-between " + isOpen}>
            <div className="w-full flex flex-col justify-start">
                <div className="w-full">
                    <DevicesOther className="fill-neutral-1000 dark:fill-darkNeutral-1000" />
                    <p className="inline-block">
                        Home
                    </p>
                </div>
                <div className="w-full">
                    <DevicesOther className="fill-neutral-1000 dark:fill-darkNeutral-1000" />
                    <p className="inline-block">
                        Home
                    </p>
                </div>
                <div className="w-full">
                    <DevicesOther className="fill-neutral-1000 dark:fill-darkNeutral-1000" />
                    <p className="inline-block">
                        Home
                    </p>
                </div>
            </div>
            <div className="bg-gray">

            </div>
        </div>
    );
}

function SideBarItem({ children, href }: { children: React.ReactNode; href: string }) {
    return (
        <div className="">
            <Link href={href} className="flex justify-center items-center">
                {children}
            </Link>
        </div>
    )
}