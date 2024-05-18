import axios from "axios"
import useAuth from "../useAuth";
import { useQuery } from "react-query";
import { TTask } from "@/interfaces/task.interface";

export default function useGetTask(taskID: string, extraQueryKeys: any[]) {
    const auth = useAuth();
    const taskQuery = useQuery({
        queryKey: (["tasks"].concat(extraQueryKeys)),
        queryFn: async () => {
            const res = await axios.get(`/api/v1/task/${taskID}`, {
                headers: {
                    Authorization: `Bearer ${auth.authToken}`
                }
            })

            if (res.status == 401) {
                auth.refreshToken()
            }

            return res.data as TTask
        },
        enabled: auth.isAuthed
    });

    return taskQuery
}