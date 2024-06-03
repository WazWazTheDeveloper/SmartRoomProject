import useAuth from "@/hooks/useAuth";
import axios from "axios";
import { useQuery } from "react-query";

export type TUserSettings = {
    isDarkmode: boolean
    favoriteDevices: TFavoriteDevoce[]
}

type TFavoriteDevoce = {
    deviceID: string
    place: number
}

export default function useGetUserSettings(userID: string, extraQueryKeys: any[] = []) {
    const auth = useAuth();
    const darkmodeQuerry = useQuery({
        queryKey: (["darkmode"].concat(extraQueryKeys)),
        queryFn: async () => {
            const res = await axios.get(`/api/v1/account/user/${userID}/settings/`, {
                headers: {
                    Authorization: `Bearer ${auth.authToken}`
                }
            })

            if (res.status == 401) {
                auth.refreshToken()
            }

            return res.data as TUserSettings
        },
        enabled: auth.isAuthed
    });

    return darkmodeQuerry
}