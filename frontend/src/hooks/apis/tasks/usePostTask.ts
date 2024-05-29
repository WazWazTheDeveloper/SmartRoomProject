import axios from "axios"
import { useMutation } from "react-query"
import useAuth from "../../useAuth";
import { TTaskProperty } from "@/interfaces/taskAPI.interface";

export default function usePostTask() {
    const auth = useAuth();
    const updateTaskMutation = useMutation({
        mutationFn: async (taskName: string) => {
            const res = await axios.post(`/api/v1/task/`, {
                taskName: taskName
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