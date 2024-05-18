import axios from "axios"
import useAuth from "../useAuth";
import { useQuery } from "react-query";
import { TDevice } from "@/interfaces/device.interface";

export default function useGetDevices(extraQueryKeys: any[] = []) {
    const auth = useAuth();
    const deviceQuery = useQuery({
        queryKey: (["devices"].concat(extraQueryKeys)),
        queryFn: async () => {
            const res = await axios.get("/api/v1/device/", {
                headers: {
                    Authorization: `Bearer ${auth.authToken}`
                }
            })

            if (res.status == 401) {
                auth.refreshToken()
            }

            // this is a work around as if you return just res.data somtimes deviceQuery.data returns an object insted pf array
            return {
                devices: res.data as TDevice[]
            }

            return res.data
        },
        enabled: auth.isAuthed
    });

    return deviceQuery
}