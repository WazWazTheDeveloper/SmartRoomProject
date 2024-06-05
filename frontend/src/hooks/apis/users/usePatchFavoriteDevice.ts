import axios from "axios"
import { useMutation } from "react-query"
import useAuth from "../../useAuth";

type TFnType = {
    userID: string
    newFavoriteDeviceID: string
}

export default function usePatchFavoriteDevice() {
    const auth = useAuth();
    const addUserFavoriteDeviceMutation = useMutation({
        mutationFn: async ({ userID, newFavoriteDeviceID }: TFnType) => {
            const res = await axios.patch(`/api/v1/account/user/${userID}/settings/favorite-devices/`, {
                newFavoriteDeviceID: newFavoriteDeviceID
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

    return addUserFavoriteDeviceMutation
}