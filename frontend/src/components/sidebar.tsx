"use client"
import useSidebarState from "@/hooks/useSidebarState";
import Link from "next/link";
import React, { createContext, useContext, useEffect } from "react";
import useAuth from "@/hooks/useAuth";

export const sidebarContext = createContext(false);

export default function Sidebar() {
    const [isSidebarOpen, setIsSidebarOpen] = useSidebarState()
    const auth = useAuth();
    useEffect(() => {
        console.log(isSidebarOpen);
    })

    const isOpen = isSidebarOpen ? "w-0" : "w-32 border-solid border-2 border-neutral-300 dark:border-darkNeutral-300"
    return (
        <div className={"fixed box-border flex flex-col overflow-hidden duration-100 bg-neutral-100 dark:bg-darkNeutral-100 h-svh " + isOpen}>
            <div className="grow-1 w-full after:content-[''] after:w-1/2 after:h-[1px] after:bg-neutral-500 dark:after:bg-darkNeutral-500 after:absolute after:bottom-['-2px'] after:left-1/4">
                <h1 className="text-center text-xl">
                    Menu
                </h1>
            </div>
            <div className="grow-1 flex flex-col justify-between h-full">
                <div className="w-full flex flex-col justify-start">
                    <SideBarItemHref href="/">
                        <p className="inline-block text-lg">
                            Home
                        </p>
                    </SideBarItemHref>
                    <SideBarItemHref href="/">
                        <p className="inline-block text-lg">
                            Devices
                        </p>
                    </SideBarItemHref>
                    <SideBarItemHref href="/">
                        <p className="inline-block text-lg">
                            Tasks
                        </p>
                    </SideBarItemHref>
                </div>
                <div className="bg-gray">
                    {
                        auth.isAuthed ?
                            <SideBarItemClick onClick={() => { auth.logout() }}>
                                <p className="inline-block text-lg">
                                    Logout
                                </p>
                            </SideBarItemClick> :
                            <SideBarItemClick onClick={() => {auth.login("admin", "admin")}}>
                                <p className="inline-block text-lg">
                                    Login
                                </p>
                            </SideBarItemClick>

                    }
                </div>
            </div>
        </div>
    );
}

function SideBarItemHref({ children, href }: { children: React.ReactNode; href: string }) {
    return (
        <Link href={href} className="w-full hover:bg-neutral-300 dark:hover:bg-darkNeutral-300 flex justify-center">
            {children}
        </Link>
    )
}

function SideBarItemClick({ children, onClick }: { children: React.ReactNode; onClick: Function }) {
    return (
        <div className="w-full hover:bg-neutral-300 dark:hover:bg-darkNeutral-300 flex justify-center" onClick={() => { onClick() }}>
            {children}
        </div>
    )
}