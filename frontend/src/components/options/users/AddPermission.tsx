'use client';
import { useState } from "react";
import { useAppdata } from "@/hooks/useAppdata";
import { useAuth } from "@/hooks/useAuth";
import { Check, DeleteForever } from "@mui/icons-material";
import DropdownMenu from "@/components/ui/dropdownMenu";
import { ApiService } from "@/services/apiService";
import { useApi } from "@/hooks/useApi";

export function AddPermission(props: any) {
    const { fetchWithReauth } = useApi();
    const { userdata } = useAuth();

    const [appdata, isAppdata] = useAppdata();

    const [permissionType, setPermissionType] = useState("select permissionType");
    const [permissionLevel, setPermissionLevel] = useState("select permissionLevel");
    const [taskId, setTaskId] = useState("");
    const [deviceId, setDeviceId] = useState("");

    const selectType = (<div className="md:h-8 md:w-48 flex items-center justify-center ring-1 max-h-1/3">
        {permissionType}
    </div>);

    const typeList = [
        {
            "itemTitle": ("device"),
            "onClick": () => { setPermissionType("device"); }
        },
        {
            "itemTitle": ("task"),
            "onClick": () => { setPermissionType("task"); }
        },
        {
            "itemTitle": ("*"),
            "onClick": () => { setPermissionType("*"); }
        },
    ];

    const selectLevel = (<div className="md:h-8 md:w-48 flex items-center justify-center ring-1 ">
        {permissionLevel}
    </div>);

    const levelList = [
        {
            "itemTitle": ("view"),
            "onClick": () => { setPermissionLevel("view"); }
        },
        {
            "itemTitle": ("edit"),
            "onClick": () => { setPermissionLevel("edit"); }
        },
        {
            "itemTitle": ("delete"),
            "onClick": () => { setPermissionLevel("delete"); }
        },
        {
            "itemTitle": ("all"),
            "onClick": () => { setPermissionLevel("*"); }
        },
    ];


    function getTaskTitleElement() {
        let title = "SelectTask";
        if (isAppdata) {
            try {
                title = appdata.getTaskByUUID(taskId).taskName;
            } catch (err) { }
        }
        if (taskId == "*") {
            title = "all";
        }
        return (
            <div className="md:h-8 md:w-48 flex items-center justify-start ring-1 overflow-ellipsis overflow-hidden whitespace-nowrap max-h-1/3">
                {title}
            </div>
        );
    }

    function createTaskList() {
        let taskList = [];
        if (isAppdata) {
            taskList.push({
                "itemTitle": "all",
                "onClick": () => { setTaskId("*"); }
            });
            for (let index = 0; index < appdata.getTaskList().length; index++) {
                const task = appdata.getTaskList()[index];
                taskList.push({
                    "itemTitle": (task.taskName),
                    "onClick": () => { setTaskId(task.taskId); }
                });
            }
        }

        return taskList;
    }

    function getDeviceTitleElement() {
        let title = "Please Select Device";
        if (isAppdata) {
            try {
                title = appdata.getDeviceByUUID(deviceId).deviceName;
            } catch (err) { }
        }
        if (deviceId == "*") {
            title = "all";
        }
        return (
            <div className="md:h-8 md:w-48 flex items-center justify-start ring-1 overflow-ellipsis overflow-hidden whitespace-nowrap w-full max-h-1/3">
                {title}
            </div>
        );
    }

    function createDeviceList() {
        let deviceList = [];
        if (isAppdata) {
            deviceList.push({
                "itemTitle": "all",
                "onClick": () => { setDeviceId("*"); }
            });
            for (let index = 0; index < appdata.getDeviceList().length; index++) {
                const device = appdata.getDeviceList()[index];
                deviceList.push({
                    "itemTitle": (device.deviceName),
                    "onClick": () => { setDeviceId(device.uuid); }
                });
            }
        }

        return deviceList;
    }


    function getCorrectSelect() {
        let list: any = [];
        let title = <></>;
        switch (permissionType) {
            case "device":
                list = createDeviceList();
                title = getDeviceTitleElement();
                break;
            case "task":
                list = createTaskList();
                title = getTaskTitleElement();
                break;
            default:
                break;
        }

        if (list.length == 0 && title == <></> || permissionType == "*") {
            return <></>;
        }

        return (
            <DropdownMenu menuItems={list} titleElement={title} />
        );
    }

    function getSelectLevel() {
        console.log();
        if (permissionType == "*") {
            return <></>;
        }
        if (taskId || deviceId) {
            return <DropdownMenu menuItems={levelList} titleElement={selectLevel} />;
        }
        return <></>;
    }

    function getNewPermissionAsString(): string {
        let newPermission = "";
        if (permissionType == "*")
            return "*";

        switch (permissionType) {
            case "device":
                newPermission += `device.${deviceId}.${permissionLevel}`;
                break;
            case "task":
                newPermission += `task.${taskId}.${permissionLevel}`;
                break;
        }
        return newPermission;
    }

    function submitAddPermission() {
        console.log("getNewPermissionAsString()");
        if (permissionType == "select permissionType" || permissionLevel == "select permissionLevel" && permissionType != "*"
            || permissionType == "device" && deviceId == ""
            || permissionType == "task" && taskId == "") {
            return;
        }

        let newPermission = getNewPermissionAsString();
        if (props.user) {
            let body = {
                targetUser: props.user.username,
                newPermission: newPermission,
            };
            fetchWithReauth("/user/permission", ApiService.REQUEST_POST, userdata.token, body);
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
                    <DeleteForever className="fill-on-surface ml-1 cursor-pointer" onClick={props.closeFunction} />
                </div>
            </div>
        </div>
    );

}
