import axios from "axios"
import { useMutation } from "react-query"
import useAuth from "../useAuth";
import { TTaskProperty } from "@/interfaces/taskAPI.interface";

export default function usePostTaskID(taskID: string) {
    const auth = useAuth();
    const updateTaskMutation = useMutation({
        mutationFn: async (propertyList: TTaskProperty[]) => {
            const res = await axios.put(`/api/v1/task/${taskID}`, {
                propertyList: propertyList
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