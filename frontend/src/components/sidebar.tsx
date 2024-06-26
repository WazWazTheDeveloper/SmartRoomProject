"use client"
import useSidebarState from "@/hooks/useSidebarState";
import Link from "next/link";
import React, { createContext, useContext, useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

export const sidebarContext = createContext(false);

export default function Sidebar() {
    const [isSidebarOpen, setIsSidebarOpen] = useSidebarState()
    const auth = useAuth();

    const isOpen = isSidebarOpen ? "w-32 border-solid border-2 " : "w-0"
    const isOpenButton = isSidebarOpen ? "left-[127px]" : "left-0"
    return (
        <>
            {/* <div className={"absolute duration-100 top-0 w-10 h-10 dark:bg-darkNeutral-100 bg-neutral-100 box-border " + isOpenButton} onClick={()=>{setIsSidebarOpen(!isSidebarOpen)}}>
                {isSidebarOpen ?
                    <ArrowLeftIcon className="fill-neutral-1000 dark:fill-darkNeutral-1000 w-full h-full border-solid border-2 border-neutral-300 dark:border-darkNeutral-300" /> :
                    <ArrowRightIcon className="fill-neutral-1000 dark:fill-darkNeutral-1000 w-full h-full border-solid border-2 border-neutral-300 dark:border-darkNeutral-300" />
                }
            </div> */}
            <div className={`fixed top-0 box-border flex flex-col overflow-hidden duration-100 border-neutral-500 dark:border-darkNeutral-500 bg-neutral-100 dark:bg-darkNeutral-100 h-svh z-50
            sm:relative sm:w-40 sm:border-r sm:h-[calc(100svh-3rem)] ` + isOpen}>
                <div className="relative grow-1 w-full after:content-[''] after:w-1/2 after:h-[1px] after:bg-neutral-500 dark:after:bg-darkNeutral-500 after:absolute after:bottom-['-2px'] after:left-1/4">
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
                        <SideBarItemHref href="/device">
                            <p className="inline-block text-lg">
                                Devices
                            </p>
                        </SideBarItemHref>
                        <SideBarItemHref href="/task">
                            <p className="inline-block text-lg">
                                Tasks
                            </p>
                        </SideBarItemHref>
                    </div>
                    <div className="bg-gray">
                        <SideBarItemHref href="/settings">
                            <p className="inline-block text-lg">
                                Settings
                            </p>
                        </SideBarItemHref>
                        {
                            auth.isAuthed ?
                                <SideBarItemClick onClick={() => { auth.logout() }}>
                                    <p className="inline-block text-lg">
                                        Logout
                                    </p>
                                </SideBarItemClick> :
                                <SideBarItemClick onClick={() => { auth.login("admin", "admin") }}>
                                    <p className="inline-block text-lg">
                                        Login
                                    </p>
                                </SideBarItemClick>

                        }
                    </div>
                </div>
            </div>
        </>
    );
}

function SideBarItemHref({ children, href }: { children: React.ReactNode; href: string }) {
    const [isSidebarOpen, setIsSidebarOpen] = useSidebarState()
    function onClickFunction() {
        setIsSidebarOpen(false)
    }

    return (
        <Link href={href} className="w-full sm:hover:bg-neutral-300 sm:dark:hover:bg-darkNeutral-300 flex justify-center" onClick={onClickFunction}>
            {children}
        </Link>
    )
}

function SideBarItemClick({ children, onClick }: { children: React.ReactNode; onClick: Function }) {
    const [isSidebarOpen, setIsSidebarOpen] = useSidebarState()
    function onClickFunction() {
        setIsSidebarOpen(false)
        onClick()
    }
    return (
        <div className="w-full hover:bg-neutral-300 dark:hover:bg-darkNeutral-300 flex justify-center" onClick={onClickFunction}>
            {children}
        </div>
    )
}