'use client';

import { useState, useEffect } from "react"
import { useAppdata } from "@/hooks/useAppdata";
import { useAuth } from "@/hooks/useAuth";
import { User } from "@/services/appdataService";
import Error from "next/error";
import SwitchButton from "@/components/ui/switchButton";
import Button from "@/components/ui/button";
import { Add, Check, DeleteForever, Edit } from "@mui/icons-material";
import DropdownMenu from "@/components/ui/dropdownMenu";
import { ApiService } from "@/services/apiService";
import { useApi } from "@/hooks/useApi";

export default function UserSettings({ params }: { params: { id: string } }) {
    const { fetchWithReauth } = useApi();
    const [appdata, isAppdata] = useAppdata();
    const { userdata } = useAuth();
    const [user, setUser] = useState<User>();

    // uservars
    const [isAdmin, setIsAdmin] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [isAddPermission, setIsAddPermission] = useState(true);
    const [permissions, setPermissions] = useState<string[]>([]);

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

    function submitDeletePermission(permission : string) {
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
                            <Add className="fill-on-surface w-6 h-6 duration-200 hover:scale-105  md:h-10 md:w-10" onClick={() => { }} />
                        </div>
                        <AddPermission user={user} />
                        {
                            permissions.map((element, i) => (
                                <div className="flex mx-1" key={i}>
                                    <div className="relative w-9/12 md:w-full flex item-center ring-1">
                                        <p className="w-full overflow-ellipsis overflow-hidden whitespace-nowrap">{element}</p>
                                    </div>
                                    <div className="flex justify-center w-3/12 relative md:w-auto md:h-full md:justify-end items-center ring-1 px-1">
                                        <Edit className="fill-on-surface ml-1 cursor-pointer" onClick={() => { }} />
                                        <DeleteForever className="fill-on-surface ml-1 cursor-pointer" onClick={() => {submitDeletePermission(element)}} />
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

function AddPermission(props: any) {
    const { fetchWithReauth } = useApi();
    const { userdata } = useAuth();

    const [appdata, isAppdata] = useAppdata();

    const [permissionType, setPermissionType] = useState("select permissionType")
    const [permissionLevel, setPermissionLevel] = useState("select permissionLevel")
    const [taskId, setTaskId] = useState("");
    const [deviceId, setDeviceId] = useState("");

    const selectType =
        (<div className="md:h-8 md:w-48 flex items-center justify-center ring-1 max-h-1/3">
            {permissionType}
        </div>);

    const typeList = [
        {
            "itemTitle": ("device"),
            "onClick": () => { setPermissionType("device") }
        },
        {
            "itemTitle": ("task"),
            "onClick": () => { setPermissionType("task") }
        },
        {
            "itemTitle": ("*"),
            "onClick": () => { setPermissionType("*") }
        },
    ]

    const selectLevel =
        (<div className="md:h-8 md:w-48 flex items-center justify-center ring-1 ">
            {permissionLevel}
        </div>);

    const levelList = [
        {
            "itemTitle": ("view"),
            "onClick": () => { setPermissionLevel("view") }
        },
        {
            "itemTitle": ("edit"),
            "onClick": () => { setPermissionLevel("edit") }
        },
        {
            "itemTitle": ("delete"),
            "onClick": () => { setPermissionLevel("delete") }
        },
        {
            "itemTitle": ("all"),
            "onClick": () => { setPermissionLevel("*") }
        },
    ]


    function getTaskTitleElement() {
        let title = "SelectTask"
        if (isAppdata) {
            try {
                title = appdata.getTaskByUUID(taskId).taskName;
            } catch (err) { }
        }
        if (taskId == "*") {
            title = "all"
        }
        return (
            <div className="md:h-8 md:w-48 flex items-center justify-start ring-1 overflow-ellipsis overflow-hidden whitespace-nowrap max-h-1/3">
                {title}
            </div>
        )
    }

    function createTaskList() {
        let taskList = [];
        if (isAppdata) {
            taskList.push({
                "itemTitle": "all",
                "onClick": () => { setTaskId("*") }
            })
            for (let index = 0; index < appdata.getTaskList().length; index++) {
                const task = appdata.getTaskList()[index];
                taskList.push({
                    "itemTitle": (task.taskName),
                    "onClick": () => { setTaskId(task.taskId) }
                })
            }
        }

        return taskList;
    }

    function getDeviceTitleElement() {
        let title = "Please Select Device"
        if (isAppdata) {
            try {
                title = appdata.getDeviceByUUID(deviceId).deviceName;
            } catch (err) { }
        }
        if (deviceId == "*") {
            title = "all"
        }
        return (
            <div className="md:h-8 md:w-48 flex items-center justify-start ring-1 overflow-ellipsis overflow-hidden whitespace-nowrap w-full max-h-1/3">
                {title}
            </div>
        )
    }

    function createDeviceList() {
        let deviceList = [];
        if (isAppdata) {
            deviceList.push({
                "itemTitle": "all",
                "onClick": () => { setDeviceId("*") }
            })
            for (let index = 0; index < appdata.getDeviceList().length; index++) {
                const device = appdata.getDeviceList()[index];
                deviceList.push({
                    "itemTitle": (device.deviceName),
                    "onClick": () => { setDeviceId(device.uuid) }
                })
            }
        }

        return deviceList;
    }


    function getCorrectSelect() {
        let list: any = [];
        let title = <></>
        switch (permissionType) {
            case "device":
                list = createDeviceList();
                title = getDeviceTitleElement()
                break;
            case "task":
                list = createTaskList();
                title = getTaskTitleElement()
                break;
            default:
                break;
        }

        if (list.length == 0 && title == <></> || permissionType == "*") {
            return <></>
        }

        return (
            <DropdownMenu menuItems={list} titleElement={title} />
        )
    }

    function getSelectLevel() {
        console.log()
        if (permissionType == "*") {
            return <></>
        }
        if (taskId || deviceId) {
            return <DropdownMenu menuItems={levelList} titleElement={selectLevel} />
        }
        return <></>
    }

    function getNewPermissionAsString(): string {
        let newPermission = "";
        if (permissionType == "*")
            return "*"

        switch (permissionType) {
            case "device":
                newPermission+=`device.${deviceId}.${permissionLevel}`
                break;
            case "task":
                newPermission+=`task.${taskId}.${permissionLevel}`
                break;
        }
        return newPermission;
    }

    function submitAddPermission() {
        console.log("getNewPermissionAsString()")
        if(permissionType == "select permissionType" || permissionLevel == "select permissionLevel"  && permissionType!="*"
        || permissionType == "device" && deviceId == ""
        || permissionType == "task" && taskId == ""
        ) {
            return
        }

        let newPermission = getNewPermissionAsString();
        if (props.user) {
            let body = {
                targetUser: props.user.username,
                newPermission: newPermission,
            }
            fetchWithReauth("/user/permission", ApiService.REQUEST_POST, userdata.token, body)
        }

        
    }

    return (
        <div>
            <div className="flex mx-1 h-8">
                <div className="relative w-9/12 md:w-full flex item-center ring-1">
                    <DropdownMenu menuItems={typeList} titleElement={selectType} />
                    {getCorrectSelect()}
                    {getSelectLevel()}
                </div>
                <div className="flex justify-center w-3/12 relative md:w-auto md:h-full md:justify-end items-center ring-1 px-1">
                    <Check className="fill-on-surface ml-1 cursor-pointer" onClick={submitAddPermission} />
                    <DeleteForever className="fill-on-surface ml-1 cursor-pointer" onClick={() => { }} />
                </div>
            </div>
        </div>
    )

}