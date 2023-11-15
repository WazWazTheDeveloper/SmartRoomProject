'use client';

import Link from "next/link";
import { DevicesOther, AccessTime, Settings, Logout, Login } from '@mui/icons-material';
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";


export default function SideBar() {
    const router = useRouter()
    const {userdata, login, logout,signup, updateUserData, isError, error} = useAuth();
    return (
        <div className="fixed flex flex-wrap content-between top-11 left-0 bg-surface w-11 h-[calc(100%-44px)] md:w-24 md:h-[calc(100%-48px)] xl:top-12">
            <div className="">
                <SideBarItem href="/devices">
                    <DevicesOther className="fill-white w-3/4 h-3/4" />
                </SideBarItem>
                <SideBarItem href="/tasks">
                    <AccessTime className="fill-white w-3/4 h-3/4" />
                </SideBarItem>
                <SideBarItem href="/settings">
                    <Settings className="fill-white w-3/4 h-3/4" />
                </SideBarItem>
            </div>
            <div onClick={() => {}} className="w-11 h-11 md:w-24 md:h-24 flex justify-center items-center cursor-pointer duration-100 hover:scale-105">
                {userdata.token != "" ? 
                <Logout className="fill-white w-3/4 h-3/4" onClick={() => {logout()}}/> : 
                <Login className="fill-white w-3/4 h-3/4" onClick={() => {router.push("/login")}}/>
                }
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