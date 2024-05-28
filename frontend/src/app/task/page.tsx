"use client"

import Loading from "@/components/loading";
import useGetTasks from "@/hooks/apis/tasks/useGetTasks";
import usePutTaskID from "@/hooks/apis/tasks/usePutTaskID";
import { TTask } from "@/interfaces/task.interface";
import { Add, Loop } from "@mui/icons-material";
import { Switch } from "@mui/material";
import { useRouter } from 'next/navigation';
import { useState } from "react";
export default function Page() {
    const taskQuery = useGetTasks();


    function createNewTask() {

    }

    return (
        <>
            <div className="text-xl bg-neutral-200 dark:bg-darkNeutral-200 border-b border-solid border-neutral-500 px-2 pb-1 box-border sm:w-full sm:text-center flex justify-between items-center">
                <div className="flex justify-start items-center">
                    Tasks
                </div>
                <Add className="w-7 h-7 fill-neutral-1000 dark:fill-darkNeutral-1000 dark:border-darkNeutral-300 border-neutral-300 cursor-pointer" onClick={createNewTask} />
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
    const router = useRouter()
    const updateTaskMutation = usePutTaskID(props.taskID);

    function redirectToTask() {
        router.push(`/task/${props.taskID}`)
    }

    function onIsOnClickHandler(e: React.ChangeEvent<HTMLInputElement>) {
        e.stopPropagation()
        setIsOn(e.target.checked)
        updateTaskMutation.mutate(
            [
                {
                    taskPropertyName: "isOn",
                    newValue: e.target.checked
                }
            ])
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
                    onClick={(e) => { e.stopPropagation() }}
                    inputProps={{ 'aria-label': 'controlled' }}
                />
            </div>
        </div>

    )
}