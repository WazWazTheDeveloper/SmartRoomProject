import axios from "axios"
import { useMutation } from "react-query"
import useAuth from "../../useAuth";
import { TDeviceProperty } from "@/interfaces/deviceAPI.interface";

export default function usePostDeviceID(deviceID: string) {
    const auth = useAuth();
    const updateTaskMutation = useMutation({
        mutationFn: async (propertyList: TDeviceProperty[]) => {
            const res = await axios.put(`/api/v1/device/${deviceID}`, {
                updateList: propertyList
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

    return updateTaskMutation
}