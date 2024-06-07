import useAuth from "@/hooks/useAuth"
import axios from "axios"
import { useMutation } from "react-query"

export type TUseDeleteFavoriteDevice = {
    userID: string
    favoriteDevicePlace: number
    favoriteDeviceID: string
}

export default function useDeleteFavoriteDevice() {
    const auth = useAuth();
    const deleteUserFavoriteDeviceMutation = useMutation({
        mutationFn: async ({ userID, favoriteDevicePlace, favoriteDeviceID }: TUseDeleteFavoriteDevice) => {
            const res = await axios.delete(`/api/v1/account/user/${userID}/settings/favorite-devices/`, {
                headers: {
                    Authorization: `Bearer ${auth.authToken}`
                },
                data: {
                    favoriteDevicePlace: favoriteDevicePlace,
                    favoriteDeviceID: favoriteDeviceID
                }
            })
            if (res.status == 401) {
                auth.refreshToken()
            }

            return res.data
        }
    })

    return deleteUserFavoriteDeviceMutation
}