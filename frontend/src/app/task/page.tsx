"use client"
import Loading from "@/components/loading";
import useAuth from "@/hooks/useAuth";
import { TTask } from "@/interfaces/task.interface";
import SwitchButton from "@/ui/switchButton";
import { Loop } from "@mui/icons-material";
import { Switch } from "@mui/material";
import axios from "axios";
import { useRouter } from 'next/navigation';
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
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

            console.log(res.data)

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
                Tasks
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
                    taskQuery.data.map((element: TTask, index) => {
                        return (
                            <ListItem isOn={element.isOn} isRepeating={element.isRepeating} taskID={element._id} taskName={element.taskName} key={index} />
                        )
                    }) : <></>
            }
        </>
    )
}

type TProps = {
    taskName: string
    taskID: string
    isOn: boolean
    isRepeating: boolean
}

function ListItem(props: TProps) {
    const [isOn, setIsOn] = useState(props.isOn)
    const auth = useAuth();
    const router = useRouter()
    const updateTaskMutation = useMutation({
        // mutationKey:[isOn],
        mutationFn: async (isOn: boolean) => {
            const res = await axios.put(`/api/v1/task/${props.taskID}`, {
                propertyList : [
                    {
                        taskPropertyName: "isOn",
                        newValue: isOn
                    }
                ]
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

    function redirectToTask() {
        router.push(`/task/${props.taskID}`)
    }

    function onIsOnClickHandler(e: React.ChangeEvent<HTMLInputElement>) {
        e.stopPropagation()
        setIsOn(e.target.checked)
        updateTaskMutation.mutate(e.target.checked)
    }


    return (
        <div className="relative flex mt-1 bg-neutral-300 dark:bg-darkNeutral-300 cursor-pointer" onClick={redirectToTask}>
            <div className={`w-full box-border h-12 pl-2 flex items-center`}>
                <h2 className="text-xl inline-block pl-1">
                    {props.taskName}
                </h2>
            </div>
            <div className="w-1/4 justify-end flex items-center pr-2">
                <Loop className={"w-6 h-6 fill-neutral-1000 dark:fill-darkNeutral-1000 " + (props.isRepeating ? "fill-green-500 dark:fill-green-500" : "")} />
                <Switch
                    checked={isOn}
                    onChange={onIsOnClickHandler}
                    onClick={(e) => {e.stopPropagation()}}
                    inputProps={{ 'aria-label': 'controlled' }}
                />
            </div>
        </div>

    )
}