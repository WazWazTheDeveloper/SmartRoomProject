import axios from "axios"
import { useMutation } from "react-query"
import useAuth from "../../useAuth";
import { TTaskProperty } from "@/interfaces/taskAPI.interface";

export default function useDeleteTaskID(taskID: string) {
    const auth = useAuth();
    const updateTaskMutation = useMutation({
        mutationFn: async () => {
            const res = await axios.delete(`/api/v1/task/${taskID}`, {
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