"use client"

import Loading from "@/components/loading"
import useAuth from "@/hooks/useAuth"
import { Loop, PowerSettingsNew } from "@mui/icons-material"
import { Switch } from "@mui/material"
import axios from "axios"
import { useEffect, useState } from "react"
import { useMutation, useQuery } from "react-query"

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

export default function Page({ params }: { params: { id: string } }) {
    const [isOn, setIsOn] = useState(false)
    const [isRepeating, setIsRepeating] = useState(false)
    const auth = useAuth();
    const deviceQuery = useQuery({
        queryKey: ["devices"],
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



    useEffect(() => {
        if (deviceQuery.isLoading || deviceQuery.isError) return

        if (!deviceQuery.data) return

        setIsOn(deviceQuery.data.isOn)
        setIsRepeating(deviceQuery.data.isRepeating)

    }, [deviceQuery.data])

    function onIsOnChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
        e.stopPropagation()
        setIsOn(e.target.checked)
        updateTaskMutation.mutate([
            {
                taskPropertyName: "isOn",
                newValue: isOn
            }
        ])
    }

    function onIsRepeatingChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
        e.stopPropagation()
        setIsRepeating(e.target.checked)
        updateTaskMutation.mutate([
            {
                taskPropertyName: "isRepeating",
                newValue: isRepeating
            }
        ])
    }

    if (deviceQuery.isLoading || deviceQuery.isError) {
        <Loading />
    }

    return (
        <>
            <div className="text-xl bg-neutral-200 dark:bg-darkNeutral-200 border-b border-solid border-neutral-500 pl-2 box-border sm:w-full sm:text-center">
                {deviceQuery.data?.taskName}
            </div>
            <div className="flex w-full flex-wrap">
                < div className='flex justify-start items-center pl-2 pr-2 w-full sm:w-full sm:max-w-[52rem] sm:justify-center' >
                    <PowerSettingsNew className='fill-neutral-1000 dark:fill-darkNeutral-1000 dark:border-darkNeutral-300' sx={{ fontSize: "2rem" }} />
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
            {
                Array.isArray(deviceQuery.data?.propertyChecks) ?
                    deviceQuery.data.propertyChecks.map((element: TPropertyCheck, index: number) => {
                        return (
                            <></>
                        )
                    })
                    : <></>
            }
            {
                Array.isArray(deviceQuery.data?.timeChecks) ?
                    deviceQuery.data.timeChecks.map((element: TTimeCheck, index: number) => {
                        return (
                            <></>
                        )
                    })
                    : <></>
            }
            {
                Array.isArray(deviceQuery.data?.todoTasks) ?
                    deviceQuery.data.todoTasks.map((element: TTodoTask, index: number) => {
                        return (
                            <></>
                        )
                    })
                    : <></>
            }
        </>
    )
}

function PropertyCheckListItem() {
    return (
        <div className="w-full">

        </div>
    )
}

function TimeCheckListItem() {
    return (
        <div className="w-full">

        </div>
    )
}

function TodoListItem() {
    return (
        <div className="w-full">

        </div>
    )
}