import axios from "axios"
import useAuth from "../../useAuth";
import { useQuery } from "react-query";
import { TDevice } from "@/interfaces/device.interface";
import { TMqttTopicObject } from "@/interfaces/mqttTopics.interface";

type TType = {
    topics : TMqttTopicObject[]
}

export default function useGetTopics(extraQueryKeys: any[] = []) {
    const auth = useAuth();
    const topicQuerry = useQuery<TType,Error>({
        queryKey: (["topics"].concat(extraQueryKeys)),
        queryFn: async () => {
            const res = await axios.get("/api/v1/topic/", {
                headers: {
                    Authorization: `Bearer ${auth.authToken}`
                }
            })

            if (res.status == 401) {
                auth.refreshToken()
            }

            // this is a work around as if you return just res.data somtimes deviceQuery.data returns an object insted pf array
            return {
                topics: res.data as TMqttTopicObject[]
            }

            return res.data
        },
        enabled: auth.isAuthed
    });

    return topicQuerry
}