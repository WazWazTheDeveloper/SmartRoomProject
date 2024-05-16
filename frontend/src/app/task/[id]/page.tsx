"use client"

import Loading from "@/components/loading"
import useAuth from "@/hooks/useAuth"
import { Delete, Edit, Loop, PowerSettingsNew } from "@mui/icons-material"
import { Switch } from "@mui/material"
import axios from "axios"
import { useEffect, useState } from "react"
import { useMutation, useQuery } from "react-query"
import cronstrue from 'cronstrue'

type TTask = {
    _id: string
    taskName: string
    isOn: boolean
    isRepeating: boolean
    propertyChecks: TPropertyCheck[]
    timeChecks: TTimeCheck[]
    todoTasks: TTodoTask[]
}

export type TPropertyCheck = {
    itemID: string
    deviceID: string
    dataID: number
    propertyName: string
    checkType: number
    valueToCompare: any
}

export type TTimeCheck = {
    itemID: string
    timingData: string
    isTrue: boolean
}

export type TTodoTask = {
    itemID: string
    deviceID: string
    dataID: number
    propertyName: string
    newValue: any
}

const CHECK_TYPE_EQUAL = 0
const CHECK_TYPE_MORE_THEN = 1
const CHECK_TYPE_LESS_THEN = 2
const CHECK_TYPE_ANY = 3

export default function Page({ params }: { params: { id: string } }) {
    const [isOn, setIsOn] = useState(false)
    const [isRepeating, setIsRepeating] = useState(false)
    const auth = useAuth();
    const updateTaskMutation = useMutation({
        // mutationKey:[isOn],
        mutationFn: async (propertyList: any[]) => {
            const res = await axios.put(`/api/v1/task/${params.id}`, {
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

    const deviceQuery = useQuery({
        queryKey: [updateTaskMutation.data],
        queryFn: async () => {
            const res = await axios.get(`/api/v1/task/${params.id}`, {
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



    useEffect(() => {
        if (deviceQuery.isLoading || deviceQuery.isError) return

        if (deviceQuery.data?.isOn) {
            setIsOn(deviceQuery.data.isOn)
        }
        if (deviceQuery.data?.isRepeating) {
            setIsRepeating(deviceQuery.data.isRepeating)
        }

    }, [deviceQuery.data])

    function onIsOnChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
        e.stopPropagation()
        setIsOn(e.target.checked)
        updateTaskMutation.mutate([
            {
                taskPropertyName: "isOn",
                newValue: e.target.checked
            }
        ])
    }

    function onIsRepeatingChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
        e.stopPropagation()
        setIsRepeating(e.target.checked)
        updateTaskMutation.mutate([
            {
                taskPropertyName: "isRepeating",
                newValue: e.target.checked
            }
        ])
    }

    function deleteItem(itemID: string,itemType : "propertyChecks" | "timeChecks" | "todoTasks") {
        updateTaskMutation.mutate([{
            taskPropertyName: itemType,
            operation: "delete",
            itemID: itemID
        }])
    }

    if (deviceQuery.isLoading || deviceQuery.isError) {
        <Loading />
    }

    return (
        <div className="pb-4">
            <div className="text-xl bg-neutral-200 dark:bg-darkNeutral-200 border-b border-solid border-neutral-500 pl-2 box-border sm:w-full sm:text-center">
                {deviceQuery.data?.taskName}
            </div>
            <div className="flex w-full flex-wrap">
                < div className='flex justify-start items-center pl-2 pr-2 w-full sm:w-full sm:max-w-[52rem] sm:justify-center' >
                    <PowerSettingsNew className='fill-neutral-1000 dark:fill-darkNeutral-1000 border-neutral-300 dark:border-darkNeutral-300' sx={{ fontSize: "2rem" }} />
                    <Switch
                        checked={isOn}
                        onChange={onIsOnChangeHandler}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                </div>
                < div className='flex justify-start items-center pl-2 pr-2 w-full sm:w-full sm:max-w-[52rem] sm:justify-center' >
                    <Loop className='fill-neutral-1000 dark:fill-darkNeutral-1000 dark:border-darkNeutral-300' sx={{ fontSize: "2rem" }} />
                    <Switch
                        checked={isRepeating}
                        onChange={onIsRepeatingChangeHandler}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                </div>
            </div>
            <div className="w-full pl-2">
                <h2 className="underline font-medium p-0 text-xl">
                    property checks
                </h2>
            </div>
            <div className="flex flex-col gap-1">
                {
                    Array.isArray(deviceQuery.data?.propertyChecks) ?
                        deviceQuery.data.propertyChecks.map((element: TPropertyCheck, index: number) => {
                            return (
                                <PropertyCheckListItem
                                    key={index}
                                    onDeleteClick={() => { deleteItem(element.itemID , "propertyChecks") }}
                                    onEditClick={() => { }} />
                            )
                        })
                        : <></>
                }
            </div>
            <div className="w-full pl-2">
                <h2 className="underline font-medium p-0 text-xl">
                    time checks
                </h2>
            </div>
            <div className="flex flex-col gap-1">
                {
                    Array.isArray(deviceQuery.data?.timeChecks) ?
                        deviceQuery.data.timeChecks.map((element: TTimeCheck, index: number) => {
                            return (
                                <TimeCheckListItem
                                    key={index}
                                    cronText={element.timingData}
                                    onDeleteClick={() => { deleteItem(element.itemID , "timeChecks") }}
                                    onEditClick={() => { }} />
                            )
                        })
                        : <></>
                }
            </div>
            <div className="w-full pl-2">
                <h2 className="underline font-medium p-0 text-xl">
                    todo
                </h2>
            </div>
            <div className="flex flex-col gap-1">
                {
                    Array.isArray(deviceQuery.data?.todoTasks) ?
                        deviceQuery.data.todoTasks.map((element: TTodoTask, index: number) => {
                            return (
                                <TodoListItem
                                    key={index}
                                    onDeleteClick={() => { deleteItem(element.itemID , "todoTasks") }}
                                    onEditClick={() => { }} />
                            )
                        })
                        : <></>
                }
            </div>
        </div>
    )
}

type TPropertyCheckProps = {
    onDeleteClick: () => void
    onEditClick: () => void
}
function PropertyCheckListItem(props: TPropertyCheckProps) {
    return (
        <div className="w-full flex bg-neutral-300 dark:bg-darkNeutral-300">
            <div className="w-4/5 pl-2 pt-2 pb-2 flex justify-start items-center flex-wrap">
                <p className="w-full">if</p>
                <p className="w-full">device name</p>
                <p className="w-full">property N.1</p>
                <p className="w-full">equal to</p>
                <p className="w-full">157</p>
            </div>
            <div className="w-1/5 flex justify-end gap-1 pr-2 items-center">
                <Edit className='fill-neutral-1000 dark:fill-darkNeutral-1000 border-neutral-300 dark:border-darkNeutral-300 h-7 w-7' onClick={props.onEditClick} />
                <Delete className='fill-neutral-1000 dark:fill-darkNeutral-1000 border-neutral-300 dark:border-darkNeutral-300 h-7 w-7' onClick={props.onDeleteClick} />
            </div>
        </div>
    )
}

type TTimeCheckProps = {
    cronText: string
    onDeleteClick: () => void
    onEditClick: () => void
}
function TimeCheckListItem(props: TTimeCheckProps) {
    return (
        <div className="w-full flex bg-neutral-300 dark:bg-darkNeutral-300">
            <div className="w-4/5 pl-2 pt-2 pb-2 flex justify-start items-center">
                <p className="w-full text-base">
                    {cronstrue.toString(props.cronText)}
                </p>
            </div>
            <div className="w-1/5 flex justify-end gap-1 pr-2 items-center">
                <Edit className='fill-neutral-1000 dark:fill-darkNeutral-1000 border-neutral-300 dark:border-darkNeutral-300 h-7 w-7' onClick={props.onEditClick} />
                <Delete className='fill-neutral-1000 dark:fill-darkNeutral-1000 border-neutral-300 dark:border-darkNeutral-300 h-7 w-7' onClick={props.onDeleteClick} />
            </div>
        </div>
    )
}

type TTodoCheckProps = {
    onDeleteClick: () => void
    onEditClick: () => void
}
function TodoListItem(props: TTodoCheckProps) {
    return (
        <div className="w-full flex bg-neutral-300 dark:bg-darkNeutral-300">
            <div className="w-4/5 pl-2 pt-2 pb-2 flex justify-start items-center">
            </div>
            <div className="w-1/5 flex justify-end gap-1 pr-2 items-center">
                <Edit className='fill-neutral-1000 dark:fill-darkNeutral-1000 border-neutral-300 dark:border-darkNeutral-300 h-7 w-7' onClick={props.onEditClick} />
                <Delete className='fill-neutral-1000 dark:fill-darkNeutral-1000 border-neutral-300 dark:border-darkNeutral-300 h-7 w-7' onClick={props.onDeleteClick} />
            </div>
        </div>
    )
}