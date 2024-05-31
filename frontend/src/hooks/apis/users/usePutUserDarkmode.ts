import axios from "axios"
import { useMutation } from "react-query"
import useAuth from "../../useAuth";

type TFnType = {
    userID: string
    isDarkmode: boolean
}
export default function usePutUserDarkmode() {
    const auth = useAuth();
    const updateUserDarkmodeMutation = useMutation({
        mutationFn: async ({ userID, isDarkmode }: TFnType) => {
            const res = await axios.put(`/api/v1/account/user/${userID}/darkmode/`, {
                isDarkmode: isDarkmode
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

    return updateUserDarkmodeMutation
}