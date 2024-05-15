"use client"
import Loading from "@/components/loading";
import useAuth from "@/hooks/useAuth";
import axios from "axios";
import { useRouter } from "next/router";
import { useQuery } from "react-query";

export default function Page() {
    const auth = useAuth();
    const taskQuery = useQuery({
        queryKey: ["tasks"],
        queryFn: async () => {
            const res = await axios.get("/api/v1/task/", {
                headers: {
                    Authorization: `Bearer ${auth.authToken}`
                }
            })

            if (res.status == 401) {
                auth.refreshToken()
            }

            return res.data
        },
        enabled: auth.isAuthed
    });

    return (
        <>
            <div className="text-xl bg-neutral-200 dark:bg-darkNeutral-200 border-b border-solid border-neutral-500 pl-2">
                Devices
            </div>
            {
                taskQuery.isLoading ?
                    <Loading /> : <></>
            }
            {
                taskQuery.isError ?
                    <Loading /> : <></>
            }
            {
                Array.isArray(taskQuery.data) ?
                    taskQuery.data.map((element, index) => {

                    }) : <></>
            }
        </>
    )
}

type TProps = {
    taskName: string
    taskID: string
}

function ListItem({ taskName, taskID }: TProps) {
    const router = useRouter()
    function redirectToTask() {
        router.push(`/task/${taskID}`)
    }
    return (
        <div className="relative flex mt-1 bg-neutral-300 dark:bg-darkNeutral-300 cursor-pointer" onClick={redirectToTask}>
            <div className={`w-full box-border h-12 pl-2 flex items-center`}>
                {/* <div className={"w-6 h-6 rounded-full " + onlineCSS} /> */}
                <h2 className="text-xl inline-block pl-1">
                    {taskName}
                </h2>
            </div>
            {/* <div className="w-1/4 justify-end flex items-center pr-2">
                <EditIcon className="w-6 h-6 fill-neutral-1000 dark:fill-darkNeutral-1000" />
            </div> */}
        </div>

    )
}