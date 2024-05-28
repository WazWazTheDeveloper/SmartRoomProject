"use client"

import Loading from "@/components/loading"
import { Add, ArrowBack, Loop, PowerSettingsNew, Settings } from "@mui/icons-material"
import { Switch } from "@mui/material"
import { useEffect, useState } from "react"
import { TPropertyCheck, TTimeCheck, TTodoTask } from "@/interfaces/task.interface"
import usePutTaskID from "@/hooks/apis/tasks/usePutTaskID"
import { AddPropertyCheck } from "@/components/taskComponents/add/addPropertyCheck"
import useGetTask from "@/hooks/apis/tasks/useGetTask"
import { AddTimeCheck } from "@/components/taskComponents/add/addTimeCheck"
import { PropertyCheckListItem } from "@/components/taskComponents/show/propertyCheckListItem"
import { TimeCheckListItem } from "@/components/taskComponents/show/timeCheckListItem"
import { TodoListItem } from "@/components/taskComponents/show/todoListItem"
import { AddTodo } from "@/components/taskComponents/add/addTodo"
import { useRouter } from "next/navigation"

export default function Page({ params }: { params: { id: string } }) {
    const router = useRouter()
    const updateTaskMutation = usePutTaskID(params.id)
    const taskQuery = useGetTask(params.id, [updateTaskMutation.data])
    const [isOn, setIsOn] = useState(false)
    const [isRepeating, setIsRepeating] = useState(false)
    const [isAddPropertyCheck, setIsAddPropertyCheck] = useState(false)
    const [isAddTimeCheck, setIsAddTimeCheck] = useState(false)
    const [isAddTodo, setIsAddTodo] = useState(false)

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

    function openAddPropertyCheck() {
        setIsAddPropertyCheck(true)
    }

    function closeAddPropertyCheck() {
        setIsAddPropertyCheck(false)
    }

    function openAddTimeCheck() {
        setIsAddTimeCheck(true)
    }

    function closeAddTimeCheck() {
        setIsAddTimeCheck(false)
    }

    function openAddTodo() {
        setIsAddTodo(true)
    }

    function closeAddTodo() {
        setIsAddTodo(false)
    }

    function goToSettings() {
        router.push(`/task/${params.id}/settings`)
    }

    function goToTasks() {
        router.push(`/task/`)
    }

    if (taskQuery.isLoading || taskQuery.isError) {
        <Loading />
    }


    return (
        <div className="pb-4">
            <div className="text-xl bg-neutral-200 dark:bg-darkNeutral-200 border-b border-solid border-neutral-500 px-2 pb-1 box-border sm:w-full sm:text-center flex justify-between items-center">
                <div className="flex justify-start items-center">
                    <ArrowBack className="w-7 h-7 fill-neutral-1000 dark:fill-darkNeutral-1000 dark:border-darkNeutral-300 border-neutral-300 mr-2 cursor-pointer" onClick={goToTasks} />
                    {taskQuery.data?.taskName}
                </div>
                <Settings className="w-7 h-7 fill-neutral-1000 dark:fill-darkNeutral-1000 dark:border-darkNeutral-300 border-neutral-300 cursor-pointer" onClick={goToSettings} />
            </div>
            <div className="flex w-full flex-wrap">
                < div className='flex justify-start items-center pl-2 pr-2 w-full sm:justify-start' >
                    <PowerSettingsNew className='fill-neutral-1000 dark:fill-darkNeutral-1000 border-neutral-300 dark:border-darkNeutral-300' sx={{ fontSize: "2rem" }} />
                    <Switch
                        checked={isOn}
                        onChange={onIsOnChangeHandler}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                </div>
                < div className='flex justify-start items-center pl-2 pr-2 w-full sm:justify-start' >
                    <Loop className='fill-neutral-1000 dark:fill-darkNeutral-1000 dark:border-darkNeutral-300' sx={{ fontSize: "2rem" }} />
                    <Switch
                        checked={isRepeating}
                        onChange={onIsRepeatingChangeHandler}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                </div>
            </div>
            <div className="w-full px-2 flex justify-between items-center">
                <h2 className="underline font-medium p-0 text-xl">
                    property checks
                </h2>
                {isAddPropertyCheck ? <></> : <Add className="w-7 h-7 fill-neutral-1000 dark:fill-darkNeutral-1000 dark:border-darkNeutral-300 border-neutral-300 cursor-pointer" onClick={openAddPropertyCheck} />}
            </div>
            <div className="flex flex-col gap-1">
                {isAddPropertyCheck ? <AddPropertyCheck
                    updateTaskMutation={updateTaskMutation}
                    onClose={closeAddPropertyCheck}
                    onDone={closeAddPropertyCheck} /> : <></>}
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
            <div className="w-full px-2 flex justify-between items-center">
                <h2 className="underline font-medium p-0 text-xl">
                    time checks
                </h2>
                {isAddTimeCheck ? <></> : <Add className="w-7 h-7 fill-neutral-1000 dark:fill-darkNeutral-1000 dark:border-darkNeutral-300 border-neutral-300 cursor-pointer" onClick={openAddTimeCheck} />}
            </div>
            <div className="flex flex-col gap-1">
                {isAddTimeCheck ? <AddTimeCheck
                    updateTaskMutation={updateTaskMutation}
                    onClose={closeAddTimeCheck}
                    onDone={closeAddTimeCheck} /> : <></>}
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
            <div className="w-full px-2 flex justify-between items-center">
                <h2 className="underline font-medium p-0 text-xl">
                    todo
                </h2>
                {isAddTodo ? <></> : <Add className="w-7 h-7 fill-neutral-1000 dark:fill-darkNeutral-1000 dark:border-darkNeutral-300 border-neutral-300 cursor-pointer" onClick={openAddTodo} />}
            </div>
            <div className="flex flex-col gap-1">
                {isAddTodo ? <AddTodo
                    updateTaskMutation={updateTaskMutation}
                    onClose={closeAddTodo}
                    onDone={closeAddTodo} /> : <></>}
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