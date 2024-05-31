import useGetUserSettings from "@/hooks/apis/users/useGetUserSettings";
import useAuth from "@/hooks/useAuth";
import { useEffect } from "react";

type Props = {
    children: JSX.Element
}

export function ThemeProvider({ children }: Props) {
    const auth = useAuth();
    const userSettingsQuerry = useGetUserSettings(auth.userID)

    useEffect(() => {
        if (typeof (userSettingsQuerry.data?.isDarkmode) == "boolean") {
            if (userSettingsQuerry.data?.isDarkmode) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
        }
    }, [userSettingsQuerry.data])
    return (
        <>
            {children}
        </>
    )
}