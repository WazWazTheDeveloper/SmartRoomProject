'use client';

import Link from "next/link";
import { DevicesOther, AccessTime, Settings, Logout } from '@mui/icons-material';


export default function SideBar() {
    return (
        <div className="fixed flex flex-wrap content-between top-11 left-0 bg-surface w-11 h-[calc(100%-44px)] md:w-24 md:h-[calc(100%-48px)] xl:top-12">
            <div className="">
                <SideBarItem href="/devices">
                    <DevicesOther className="fill-white w-3/4 h-3/4" />
                </SideBarItem>
                <SideBarItem href="/scheduled_tasks">
                    <AccessTime className="fill-white w-3/4 h-3/4" />
                </SideBarItem>
                <SideBarItem href="/settings">
                    <Settings className="fill-white w-3/4 h-3/4" />
                </SideBarItem>
            </div>
            <div onClick={() => {}} className="w-11 h-11 md:w-24 md:h-24 flex justify-center items-center cursor-pointer duration-100 hover:scale-105">
                <Logout className="fill-white w-3/4 h-3/4"/>
            </div>
        </div>
    )
}
 
function SideBarItem({ children, href }: { children: React.ReactNode; href: string }) {
    return (
        <div className="w-11 h-11 md:w-24 md:h-24 flex justify-center items-center cursor-pointer duration-100 hover:scale-105">
            <Link href={href} className="flex justify-center items-center">
                {children}
            </Link>
        </div>
    )
}