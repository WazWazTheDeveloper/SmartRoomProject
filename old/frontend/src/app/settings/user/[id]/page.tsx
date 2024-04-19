'use client';

import { useState, useEffect } from "react"
import { useAppdata } from "@/hooks/useAppdata";
import { useAuth } from "@/hooks/useAuth";
import { User } from "@/services/appdataService";
import Error from "next/error";
import SwitchButton from "@/components/ui/switchButton";
import Button from "@/components/ui/button";
import { Add, DeleteForever, Edit } from "@mui/icons-material";
import { ApiService } from "@/services/apiService";
import { useApi } from "@/hooks/useApi";
import { AddPermission } from "../../../../components/options/users/AddPermission";
import { AddPermissionGroup } from "@/components/options/users/AddPermissionGroup";

export default function UserSettings({ params }: { params: { id: string } }) {
    const { fetchWithReauth } = useApi();
    const [appdata, isAppdata] = useAppdata();
    const { userdata } = useAuth();
    const [user, setUser] = useState<User>();

    // uservars
    const [isAdmin, setIsAdmin] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [isAddPermission, setIsAddPermission] = useState(false);
    const [isAddPermissionGroup, setIsAddPermissionGroup] = useState(false);
    const [permissions, setPermissions] = useState<string[]>([]);
    const [permissionGroups, setPermissionGroups] = useState<string[]>([]);

    useEffect(() => {
        if (isAppdata) {
            try {
                const _user = appdata.getUserById(params.id);
                setUser(_user)
                setIsAdmin(_user.isAdmin)
                setIsActive(_user.isActive)
                setPermissions(_user.permission)
            } catch (err) { }
        }
    }, [params.id, appdata, isAppdata])

    function onIsAdminChange(checked: boolean) {
        setIsAdmin(!isAdmin)
        submitIsAdmin(!isAdmin)
        // toUpdate.current = true;
    }

    function onIsActiveChange(checked: boolean) {
        setIsActive(!isActive)
        submitIsActive(!isActive)
        // toUpdate.current = true;
    }

    if (isAppdata && userdata && !userdata.isAdmin) {
        return (
            <Error statusCode={401} />
        )
    }

    if (isAppdata && !appdata.checkIfUserExist(params.id)) {
        return (
            <Error statusCode={404} />
        )
    }

    function submitIsAdmin(isAdmin: boolean) {
        if (user) {
            let body = {
                targetUser: user.username,
                newState: isAdmin
            }
            fetchWithReauth("/user/is_admin", ApiService.REQUEST_PUT, userdata.token, body)
        }
    }


    function submitIsActive(isActive: boolean) {
        if (user) {
            let body = {
                targetUser: user.username,
                newState: isActive
            }
            fetchWithReauth("/user/is_active", ApiService.REQUEST_PUT, userdata.token, body)
        }
    }

    function submitResetPassword() {
        if (user) {
            let body = {
                targetUser: user.username,
                newPassword: "a123",
            }
            fetchWithReauth("/user/reset_password", ApiService.REQUEST_PUT, userdata.token, body)
        }
    }

    function submitDeletePermission(permission: string) {
        if (user) {
            let body = {
                targetUser: user.username,
                permission: permission,
            }
            fetchWithReauth("/user/permission", ApiService.REQUEST_DELETE, userdata.token, body)
        }
    }

    return (
        <div className="w-full flex justify-center">
            <div className="w-full md:w-3/5 flex content-start flex-wrap bg-surface pb-4 px-2">
                <h1 className="w-full text-on-surface text-xl text-center pb-2">
                    {user ? user.username : "username"}
                </h1>
                <div className="w-full flex content-center items-start flex-wrap gap-y-4 text-on-surface">
                    <div className="flex justify-start gap-x-2.5 items-center w-full">
                        <button
                            type="button"
                            className={"outline-none flex justify-center content-center text-white ring-1 font-medium rounded-lg text-sm p-2 bg-red-500 hover:bg-red-800"}
                            onClick={submitResetPassword}
                        >
                            {"RESET PASSWORD"}
                        </button>
                    </div>
                    <div className="flex justify-start gap-x-2.5 items-center w-full">
                        <p>Is active:</p>
                        <div className="flex flex-wrap content-center justify-center gap-x-5">
                            <SwitchButton
                                state={isActive}
                                stateChangeFunction={onIsActiveChange}
                            />
                        </div>
                    </div>
                    <div className="flex justify-start gap-x-2.5 items-center w-full">
                        <p>Is admin:</p>
                        <div className="flex flex-wrap content-center justify-center gap-x-5">
                            <SwitchButton
                                state={isAdmin}
                                stateChangeFunction={onIsAdminChange}
                            />
                        </div>
                    </div>

                    <div className="w-full ring-1 ring-white pb-4">
                        <div className="w-full flex justify-between items-center">
                            <p className="ml-1 text-lg">Permissions:</p>
                            <Add className="fill-on-surface w-6 h-6 duration-200 hover:scale-105  md:h-10 md:w-10 cursor-pointer" onClick={() => {setIsAddPermission(true)}} />
                        </div>
                        {isAddPermission ?
                            <AddPermission 
                            user={user}
                            closeFunction={() => {setIsAddPermission(false)}} /> :
                            <></>
                        }
                        {
                            permissions.map((element, i) => (
                                <div className="flex mx-1" key={i}>
                                    <div className="relative w-9/12 md:w-full flex item-center ring-1">
                                        <p className="w-full overflow-ellipsis overflow-hidden whitespace-nowrap">{element}</p>
                                    </div>
                                    <div className="flex justify-center w-3/12 relative md:w-auto md:h-full md:justify-end items-center ring-1 px-1">
                                        <Edit className="fill-on-surface ml-1 cursor-pointer" onClick={() => { }} />
                                        <DeleteForever className="fill-on-surface ml-1 cursor-pointer" onClick={() => { submitDeletePermission(element) }} />
                                    </div>
                                </div>
                            ))
                        }
                    </div>

                    <div className="w-full ring-1 ring-white pb-4">
                        <div className="w-full flex justify-between items-center">
                            <p className="ml-1 text-lg">Permissions Groups:</p>
                            <Add className="fill-on-surface w-6 h-6 duration-200 hover:scale-105  md:h-10 md:w-10 cursor-pointer" onClick={() => {setIsAddPermissionGroup(true)}} />
                        </div>
                        {isAddPermission ?
                            <AddPermissionGroup 
                            user={user}
                            closeFunction={() => {setIsAddPermissionGroup(false)}} /> :
                            <></>
                        }
                        {
                            permissionGroups.map((element, i) => (
                                <div className="flex mx-1" key={i}>
                                    <div className="relative w-9/12 md:w-full flex item-center ring-1">
                                        <p className="w-full overflow-ellipsis overflow-hidden whitespace-nowrap">{element}</p>
                                    </div>
                                    <div className="flex justify-center w-3/12 relative md:w-auto md:h-full md:justify-end items-center ring-1 px-1">
                                        <DeleteForever className="fill-on-surface ml-1 cursor-pointer" onClick={() => { submitDeletePermission(element) }} />
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}