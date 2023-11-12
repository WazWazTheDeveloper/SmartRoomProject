'use client';

import { useAppdata } from "@/hooks/useAppdata";
import { useAuth } from "@/hooks/useAuth";
import { DeleteForever, Settings } from "@mui/icons-material";
import Error from "next/error";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react"

export default function UsersSettingsPage() {
    const router = useRouter()
    
    const [appdata, isAppdata] = useAppdata();
    const { userdata } = useAuth();

    const [userList, setUserList] = useState<React.ReactNode>([]);


    function redirectToUserSettingsPage(id: string) {
        router.push(`/settings/user/${id}`)
    }
    
    useEffect(() => {
        if(!isAppdata) return;
        let _userList = [];
        for (let index = 0; index < appdata.getUserList().length; index++) {
            const user = appdata.getUserList()[index];
            const element =
                <div key={index} className="relative w-full flex h-9 flex-nowrap justify-start items-center overflow-hidden md:h-9">
                    <div className="relative w-9/12 md:w-[70%] ml-2 flex item-center">
                        <p className="w-full overflow-ellipsis overflow-hidden whitespace-nowrap">{user.username}</p>
                    </div>
                    <div className="flex justify-center w-3/12 relative md:w-[30%] md:h-full md:justify-end items-center">
                        <Settings className="fill-on-surface ml-1 cursor-pointer" onClick={() => {redirectToUserSettingsPage(user.uuid)}} />
                        <DeleteForever className="fill-on-surface ml-1 cursor-pointer" onClick={() => {  }} />
                    </div>
                </div>
            _userList.push(element)
        }
        setUserList(_userList)
    }, [appdata, isAppdata])

    if (userdata && !userdata.isAdmin) {
        return (
            <Error statusCode={401} />
        )
    }

    return (
        <div className="w-full md:w-3/5 text-on-surface bg-surface">
            <p className="underline">Users:</p>
            {userList}
        </div>
    )
}