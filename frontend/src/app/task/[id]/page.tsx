"use client"

import Loading from "@/components/loading"
import { Delete, Edit, Loop, PowerSettingsNew } from "@mui/icons-material"
import { Switch } from "@mui/material"
import { useEffect, useState } from "react"
import cronstrue from 'cronstrue'
import { CHECK_TYPE_EQUAL, CHECK_TYPE_LESS_THEN, CHECK_TYPE_MORE_THEN, TPropertyCheck, TTask, TTimeCheck, TTodoTask } from "@/interfaces/task.interface"
import usePostTaskID from "@/hooks/apis/usePostTaskID"
import { AddPropertyCheck } from "@/components/taskComponents/addPropertyCheck"
import useGetTask from "@/hooks/apis/useGetTask"
import useGetDevice from "@/hooks/apis/useGetDevice"

export default function Page({ params }: { params: { id: string } }) {
    const [isOn, setIsOn] = useState(false)
    const [isRepeating, setIsRepeating] = useState(false)
    const updateTaskMutation = usePostTaskID(params.id)
    const taskQuery = useGetTask(params.id,[updateTaskMutation.data])

    useEffect(() => {
        if (taskQuery.isLoading || taskQuery.isError) return

        if (taskQuery.data?.isOn) {
            setIsOn(taskQuery.data.isOn)
        }
        if (taskQuery.data?.isRepeating) {
            setIsRepeating(taskQuery.data.isRepeating)
        }

    }, [taskQuery.data])

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

    function deleteItem(itemID: string, itemType: "propertyChecks" | "timeChecks" | "todoTasks") {
        updateTaskMutation.mutate([{
            taskPropertyName: itemType,
            operation: "delete",
            itemID: itemID
        }])
    }

    if (taskQuery.isLoading || taskQuery.isError) {
        <Loading />
    }

    return (
        <div className="pb-4">
            <div className="text-xl bg-neutral-200 dark:bg-darkNeutral-200 border-b border-solid border-neutral-500 pl-2 box-border sm:w-full sm:text-center">
                {taskQuery.data?.taskName}
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
            <AddPropertyCheck updateTaskMutation={updateTaskMutation} />
            <div className="w-full pl-2">
                <h2 className="underline font-medium p-0 text-xl">
                    property checks
                </h2>
            </div>
            <div className="flex flex-col gap-1">
                {
                    Array.isArray(taskQuery.data?.propertyChecks) ?
                        taskQuery.data.propertyChecks.map((element: TPropertyCheck, index: number) => {
                            return (
                                <PropertyCheckListItem
                                    key={index}
                                    onDeleteClick={() => { deleteItem(element.itemID, "propertyChecks") }}
                                    onEditClick={() => { }}
                                    item={element} />
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
                    Array.isArray(taskQuery.data?.timeChecks) ?
                        taskQuery.data.timeChecks.map((element: TTimeCheck, index: number) => {
                            return (
                                <TimeCheckListItem
                                    key={index}
                                    cronText={element.timingData}
                                    onDeleteClick={() => { deleteItem(element.itemID, "timeChecks") }}
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
                    Array.isArray(taskQuery.data?.todoTasks) ?
                        taskQuery.data.todoTasks.map((element: TTodoTask, index: number) => {
                            return (
                                <TodoListItem
                                    key={index}
                                    onDeleteClick={() => { deleteItem(element.itemID, "todoTasks") }}
                                    onEditClick={() => { }}
                                    item={element} />
                            )
                        })
                        : <></>
                }
            </div>
        </div>
    )
}

type TPropertyCheckProps = {
    item: TPropertyCheck
    onDeleteClick: () => void
    onEditClick: () => void
}

function PropertyCheckListItem(props: TPropertyCheckProps) {
    const [deviceName, setDeviceName] = useState(props.item.deviceID)
    const [propertyName, setPropertyName] = useState(`no.${props.item.dataID}`)
    const deviceQuery = useGetDevice(props.item.deviceID)

    useEffect(() => {
        if (deviceQuery.isLoading) return
        if (deviceQuery.isError) return

        if (deviceQuery.data?.deviceName) {
            setDeviceName(deviceQuery.data.deviceName)
        }
        if (deviceQuery.data &&
            deviceQuery.data.data &&
            deviceQuery.data.data[props.item.dataID].dataTitle &&
            deviceQuery.data.data[props.item.dataID].dataTitle != "") {
            setPropertyName(deviceQuery.data?.data[props.item.dataID].dataTitle)
        }
    }, [deviceQuery.data])

    let checkType = "null"
    switch (props.item.checkType) {
        case CHECK_TYPE_EQUAL: {
            checkType = 'equal to'
            break;
        }
        case CHECK_TYPE_MORE_THEN: {
            checkType = 'more then'
            break;
        }
        case CHECK_TYPE_LESS_THEN: {
            checkType = 'less then'
            break;
        }
        default: {
            checkType = 'unknown'
            break;
        }
    }
    return (
        <div className="w-full flex bg-neutral-300 dark:bg-darkNeutral-300">
            <div className="w-4/5 pl-2 pt-2 pb-2 flex justify-start items-center flex-wrap">
                <p className="w-full">{`If ${deviceName} propery ${propertyName} is ${checkType} ${props.item.valueToCompare}`}</p>
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
    item: TTodoTask
    onDeleteClick: () => void
    onEditClick: () => void
}
function TodoListItem(props: TTodoCheckProps) {
    const [deviceName, setDeviceName] = useState(props.item.deviceID)
    const [propertyName, setPropertyName] = useState(`no.${props.item.dataID}`)
    const deviceQuery = useGetDevice(props.item.deviceID)

    useEffect(() => {
        if (deviceQuery.isLoading) return
        if (deviceQuery.isError) return

        if (deviceQuery.data?.deviceName) {
            setDeviceName(deviceQuery.data.deviceName)
        }
        if (deviceQuery.data &&
            deviceQuery.data.data &&
            deviceQuery.data.data[props.item.dataID].dataTitle &&
            deviceQuery.data.data[props.item.dataID].dataTitle != "") {
            setPropertyName(deviceQuery.data?.data[props.item.dataID].dataTitle)
        }
    }, [deviceQuery.data])

    return (
        <div className="w-full flex bg-neutral-300 dark:bg-darkNeutral-300">
            <div className="w-4/5 pl-2 pt-2 pb-2 flex justify-start items-center">
                <p className="w-full">{`Change ${deviceName}'s property ${propertyName} to ${props.item.newValue}`}</p>
            </div>
            <div className="w-1/5 flex justify-end gap-1 pr-2 items-center">
                <Edit className='fill-neutral-1000 dark:fill-darkNeutral-1000 border-neutral-300 dark:border-darkNeutral-300 h-7 w-7' onClick={props.onEditClick} />
                <Delete className='fill-neutral-1000 dark:fill-darkNeutral-1000 border-neutral-300 dark:border-darkNeutral-300 h-7 w-7' onClick={props.onDeleteClick} />
            </div>
        </div>
    )
}