'use client';

import { useAppdata } from "@/hooks/useAppdata";
import { useAuth } from "@/hooks/useAuth";
import { DeleteForever, Settings } from "@mui/icons-material";
import Error from "next/error";
import { useRouter } from "next/navigation";

export default function UsersSettingsPage() {
    const router = useRouter()

    const [appdata, isAppdata] = useAppdata();
    const { userdata } = useAuth();

    function redirectToUserSettingsPage(id: string) {
        router.push(`/settings/user/${id}`)
    }

    if (userdata && !userdata.isAdmin) {
        return (
            <Error statusCode={401} />
        )
    }

    return (
        <div className="w-full md:w-3/5 text-on-surface bg-surface">
            <p className="underline">Users:</p>
            {isAppdata ? appdata.getUserList().map((user, index) =>
                <div key={index} className="relative w-full flex h-9 flex-nowrap justify-start items-center overflow-hidden md:h-9">
                    <div className="relative w-9/12 md:w-[70%] ml-2 flex item-center">
                        <p className="w-full overflow-ellipsis overflow-hidden whitespace-nowrap">{user.username}</p>
                    </div>
                    <div className="flex justify-center w-3/12 relative md:w-[30%] md:h-full md:justify-end items-center">
                        <Settings className="fill-on-surface ml-1 cursor-pointer" onClick={() => { redirectToUserSettingsPage(user.uuid) }} />
                        <DeleteForever className="fill-on-surface ml-1 cursor-pointer" onClick={() => { }} />
                    </div>
                </div>
            ) : <></>}
        </div>
    )
}