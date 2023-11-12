'use client';

import DevicesSettingsPage from "@/components/options/devices/devicesSettingsPage";
import UserSettingsPage from "@/components/options/users/usersSettingsPage";
import Button from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react"

export default function Settings() {
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
            default:
                setSettingsPageElement(<></>)
                break;
        }
    }, [settingsPage])

    return (
        <div className="w-full min-h-screen">
            <div className="flex py-2 px-8 bg-surface flex-wrap">
                <Button isFocused={settingsPage === 0} className="h-10 w-20 md:w-32" onClick={() => { setSettingsPage(0) }}>
                    {"General"}
                </Button>
                <Button isFocused={settingsPage === 1} className={"h-10 w-20 md:w-32" + (userdata.isAdmin ? '' : " hidden")} onClick={() => { setSettingsPage(1); }}>
                    {"Users"}
                </Button>
                <Button isFocused={settingsPage === 2} className={"h-10 w-20 md:w-32" + (userdata.isAdmin ? '' : " hidden")} onClick={() => { setSettingsPage(2); }}>
                    {"Devices"}
                </Button>
            </div>
            {settingsPageElement}
        </div>
    )
}