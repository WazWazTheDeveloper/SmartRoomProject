'use client';

import DevicesSettingsPage from "@/components/options/devices/devicesSettingsPage";
import { PermissionGroupsSettingsPage } from "@/components/options/permissionGroups/PermissionGroupsSettingsPage";
import UserSettingsPage from "@/components/options/users/usersSettingsPage";
import Button from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react"

export default function Settings() {
    const tabs = ["General", "Users", "Devices", "Permission Groups"]

    const { userdata } = useAuth();

    const [settingsPage, setSettingsPage] = useState(0);
    const [settingsPageElement, setSettingsPageElement] = useState(<></>);

    useEffect(() => {
        switch (settingsPage) {
            case 0:
                setSettingsPageElement(<></>)
                break;
            case 1:
                setSettingsPageElement(<UserSettingsPage />)
                break;
            case 2:
                setSettingsPageElement(<DevicesSettingsPage />)
                break;
            case 3:
                setSettingsPageElement(<PermissionGroupsSettingsPage />)
                break;
            default:
                setSettingsPageElement(<></>)
                break;
        }
    }, [settingsPage])

    return (
        <div className="w-full min-h-screen">
            <div className="flex py-2 px-8 bg-surface flex-wrap">
                {tabs.map((title, index) =>
                    <Button key={index} isFocused={settingsPage === index} className="h-10 min-w-20 md:min-w-32" onClick={() => { setSettingsPage(index) }}>
                        {title}
                    </Button>)}

                {/* <Button isFocused={settingsPage === 0} className="h-10 w-20 md:w-32" onClick={() => { setSettingsPage(0) }}>
                    {"General"}
                </Button>
                <Button isFocused={settingsPage === 1} className={"h-10 w-20 md:w-32" + (userdata.isAdmin ? '' : " hidden")} onClick={() => { setSettingsPage(1); }}>
                    {"Users"}
                </Button>
                <Button isFocused={settingsPage === 2} className={"h-10 w-20 md:w-32" + (userdata.isAdmin ? '' : " hidden")} onClick={() => { setSettingsPage(2); }}>
                    {"Devices"}
                </Button>
                <Button isFocused={settingsPage === 3} className={"h-10 w-20 md:w-32" + (userdata.isAdmin ? '' : " hidden")} onClick={() => { setSettingsPage(3); }}>
                    {"Devices"}
                </Button> */}
            </div>
            {settingsPageElement}
        </div>
    )
}