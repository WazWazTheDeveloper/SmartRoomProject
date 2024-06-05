import axios from "axios"
import { useMutation } from "react-query"
import useAuth from "../../useAuth";

type TFnType = {
    userID: string
    favoriteDevicePlace: number
}

export default function useDeleteFavoriteDevice() {
    const auth = useAuth();
    const deleteUserFavoriteDeviceMutation = useMutation({
        mutationFn: async ({ userID, favoriteDevicePlace }: TFnType) => {
            const res = await axios.patch(`/api/v1/account/user/${userID}/settings/favorite-devices/`, {
                favoriteDevicePlace: favoriteDevicePlace
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

    return deleteUserFavoriteDeviceMutation
}