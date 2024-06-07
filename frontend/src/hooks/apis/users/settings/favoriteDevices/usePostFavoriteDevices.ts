import useAuth from "@/hooks/useAuth"
import { TFavoriteDevice } from "@/interfaces/userAPI.interface"
import axios from "axios"
import { useMutation } from "react-query"

type TFnType = {
    userID: string
    newFavoriteDeviceList: TFavoriteDevice[]
}

export default function usePostFavoriteDevice() {
    const auth = useAuth();
    const updateUserFavoriteDeviceMutation = useMutation({
        mutationFn: async ({ userID, newFavoriteDeviceList }: TFnType) => {
            const res = await axios.post(`/api/v1/account/user/${userID}/settings/favorite-devices/`, {
                favoriteDevices: newFavoriteDeviceList
            }, {
                headers: {
                    Authorization: `Bearer ${auth.authToken}`
                }
            })
            if (res.status == 401) {
                auth.refreshToken()
            }

            return res.data
        }
    })

    return updateUserFavoriteDeviceMutation
}