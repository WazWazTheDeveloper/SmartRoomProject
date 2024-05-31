'use client'

import useGetUserSettings from "@/hooks/apis/users/useGetUserSettings";
import usePutUserDarkmode from "@/hooks/apis/users/usePutUserDarkmode";
import useAuth from "@/hooks/useAuth";
import { DarkMode, LightMode, PowerSettingsNew } from "@mui/icons-material";
import { Switch } from "@mui/material";
import { useEffect, useState } from "react";

export default function Page() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const auth = useAuth();
    const updateUserDarkmodeMutation = usePutUserDarkmode()
    const userSettingsQuerry = useGetUserSettings(auth.userID)

    useEffect(() => {
        if (typeof (userSettingsQuerry.data?.isDarkmode) == "boolean") {
            setIsDarkMode(userSettingsQuerry.data?.isDarkmode)
        }
    }, [userSettingsQuerry.data])

    function onIsDarkModeChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
        e.stopPropagation()
        setIsDarkMode(e.target.checked)
        if (e.target.checked) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        updateUserDarkmodeMutation.mutate({
            userID: auth.userID,
            isDarkmode: e.target.checked
        })
    }

    return (
        <div className="pb-4">
            <div className="text-xl bg-neutral-200 dark:bg-darkNeutral-200 border-b border-solid border-neutral-500 px-2 pb-1 box-border sm:w-full sm:text-center flex justify-between items-center">
                <div className="flex justify-start items-center">
                    User settings
                </div>
            </div>
            <div className="flex w-full flex-wrap">
                < div className='flex justify-start items-center pl-2 pr-2 w-full sm:justify-start' >
                    {
                        isDarkMode ?
                            <DarkMode className='fill-neutral-1000 dark:fill-darkNeutral-1000 border-neutral-300 dark:border-darkNeutral-300' sx={{ fontSize: "2rem" }} /> :
                            <LightMode className='fill-neutral-1000 dark:fill-darkNeutral-1000 border-neutral-300 dark:border-darkNeutral-300' sx={{ fontSize: "2rem" }} />
                    }
                    <Switch
                        checked={isDarkMode}
                        onChange={onIsDarkModeChangeHandler}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                </div>
            </div>
        </div>
    )
}