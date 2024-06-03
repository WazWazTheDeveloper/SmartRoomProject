import axios from "axios"
import useAuth from "../../useAuth";
import { useQuery } from "react-query";
import { TDevice } from "@/interfaces/device.interface";

export default function usePostDevice(deviceIDList:string[],extraQueryKeys: any[] = []) {
    const auth = useAuth();
    const deviceQuery = useQuery({
        queryKey: (["device"].concat(extraQueryKeys)),
        queryFn: async () => {
            const res = await axios.post(`/api/v1/device/`,{
                deviceIDList: deviceIDList
            },{
                headers: {
                    Authorization: `Bearer ${auth.authToken}`
                }
            })

            if (res.status == 401) {
                auth.refreshToken()
            }

            return res.data as TDevice[]
        },
        enabled: auth.isAuthed
    });

    return deviceQuery
}