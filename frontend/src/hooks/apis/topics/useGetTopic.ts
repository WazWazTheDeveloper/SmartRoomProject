import useAuth from "@/hooks/useAuth";
import { TMqttTopicObject } from "@/interfaces/mqttTopics.interface";
import axios from "axios";
import { useQuery } from "react-query";

export function useGetTopic(topidID: string, extraQueryKeys: any[] = []) {
    const auth = useAuth();
    const topicQuerry = useQuery<TMqttTopicObject,Error>({
        queryKey: (["topics"].concat(extraQueryKeys)),
        queryFn: async () => {
            const res = await axios.get(`/api/v1/topic/${topidID}`, {
                headers: {
                    Authorization: `Bearer ${auth.authToken}`
                }
            })

            if (res.status == 401) {
                auth.refreshToken()
            }

            return res.data as TMqttTopicObject
        },
        enabled: auth.isAuthed
    });

    return topicQuerry
}