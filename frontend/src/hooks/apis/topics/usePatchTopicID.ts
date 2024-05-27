import useAuth from "@/hooks/useAuth";
import { TMqttTopicProperty } from "@/interfaces/mqttTopicsAPI.interface";
import axios from "axios";
import { useMutation } from "react-query";

export function usePatchTopicID(topidID: string) {
    const auth = useAuth();
    const updateTopicMutation = useMutation({
        mutationFn: async (updateList: TMqttTopicProperty[]) => {
            const res = await axios.patch(`/api/v1/topic/${topidID}`, {
                updateList: updateList
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
    });

    return updateTopicMutation
}