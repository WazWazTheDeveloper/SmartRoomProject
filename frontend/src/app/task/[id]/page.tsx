"use client"

import Loading from "@/components/loading"
import useAuth from "@/hooks/useAuth"
import { Close, Delete, Done, Edit, Loop, PowerSettingsNew } from "@mui/icons-material"
import { Switch } from "@mui/material"
import axios from "axios"
import { ChangeEvent, useEffect, useState } from "react"
import { useMutation, useQuery } from "react-query"
import cronstrue from 'cronstrue'
import { CHECK_TYPE_EQUAL, CHECK_TYPE_LESS_THEN, CHECK_TYPE_MORE_THEN, TPropertyCheck, TTask, TTimeCheck, TTodoTask } from "@/interfaces/task.interface"
import { MULTI_STATE_BUTTON_TYPE, NUMBER_TYPE, SWITCH_TYPE, TDevice, TDeviceDataObject } from "@/interfaces/device.interface"

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

    function deleteItem(itemID: string, itemType: "propertyChecks" | "timeChecks" | "todoTasks") {
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
            <AddPropertyCheck />
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
                    Array.isArray(deviceQuery.data?.timeChecks) ?
                        deviceQuery.data.timeChecks.map((element: TTimeCheck, index: number) => {
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
                    Array.isArray(deviceQuery.data?.todoTasks) ?
                        deviceQuery.data.todoTasks.map((element: TTodoTask, index: number) => {
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
    const auth = useAuth();
    const deviceQuery = useQuery({
        queryKey: ["devices"],
        queryFn: async () => {
            const res = await axios.get(`/api/v1/device/${props.item.deviceID}`, {
                headers: {
                    Authorization: `Bearer ${auth.authToken}`
                }
            })

            if (res.status == 401) {
                auth.refreshToken()
            }

            return res.data as TDevice
        },
        enabled: auth.isAuthed
    });

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
    const auth = useAuth();
    const deviceQuery = useQuery({
        queryKey: ["devices"],
        queryFn: async () => {
            const res = await axios.get(`/api/v1/device/${props.item.deviceID}`, {
                headers: {
                    Authorization: `Bearer ${auth.authToken}`
                }
            })

            if (res.status == 401) {
                auth.refreshToken()
            }

            return res.data as TDevice
        },
        enabled: auth.isAuthed
    });

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

type TAddPropertyCheckProps = {

}
function AddPropertyCheck(props: TAddPropertyCheckProps) {
    const [selectedDevice, setSelectedDevice] = useState(0);
    const [selectedProperty, setSelectedProperty] = useState(0);
    const [checkType, setCheckType] = useState(0);
    const [compareTo, setCompareTo] = useState<number | string>("");
    const auth = useAuth();
    const deviceQuery = useQuery({
        queryFn: async () => {
            const res = await axios.get("/api/v1/device/", {
                headers: {
                    Authorization: `Bearer ${auth.authToken}`
                }
            })

            if (res.status == 401) {
                auth.refreshToken()
            }

            // this is a work around as if you return just res.data somtimes deviceQuery.data returns an object insted pf array
            return {
                devices: res.data as TDevice[]
            }
            // return res.data as TDevice[]
        },
        enabled: auth.isAuthed
    });

    function onInputChangeHandler(e: ChangeEvent<HTMLInputElement>) {
        setCompareTo(e.target.value)
    }

    return (
        <div className="w-full flex bg-neutral-300 dark:bg-darkNeutral-300">
            <div className="w-4/5 pl-2 pt-2 pb-2 flex justify-start items-center">
                <form className="w-full flex flex-wrap gap-y-2">
                    <label htmlFor="device">When </label>
                    <select name="device" id="device"
                        onChange={(e) => { setSelectedDevice(Number(e.target.value)) }}>
                        {Array.isArray(deviceQuery.data?.devices) ?
                            deviceQuery.data?.devices.map((element: TDevice, index) => {
                                return (
                                    <option key={index} value={index}>{`${element.deviceName}`}</option>
                                )
                            }) : <></>}
                        <option value={1}>Saab</option>
                        <option value={2}>Opel</option>
                        <option value={3}>Audi</option>
                    </select>
                    <label htmlFor="property">{`'s property `}</label>
                    <select name="property" id="property"
                        onChange={(e) => { setSelectedProperty(Number(e.target.value)) }}>
                        {deviceQuery.data && deviceQuery.data.devices && deviceQuery.data.devices[selectedDevice] ?
                            deviceQuery.data.devices[selectedDevice].data.map((element, index) => {
                                return (
                                    <option key={index} value={index}>{`${element.dataTitle}'s`}</option>
                                )
                            }) : <></>}
                    </select>
                    <label htmlFor="checkType"> is </label>
                    {/* <select name="checkType" id="checkType"
                        onChange={(e) => { setCheckType(Number(e.target.value)) }}>
                        <option value={CHECK_TYPE_EQUAL}>equal to</option>
                        <option value={CHECK_TYPE_MORE_THEN}>more then</option>
                        <option value={CHECK_TYPE_LESS_THEN}>less then</option>
                    </select> */}
                    {/* <input type="text" className="w-full" value={compareTo} onChange={onInputChangeHandler} /> */}
                    {deviceQuery.data && deviceQuery.data.devices && deviceQuery.data.devices[selectedDevice] ?
                        <AddPropertyCheckInput
                            data={deviceQuery.data.devices[selectedDevice].data[selectedProperty]}
                            setInput={(val: string | number) => { setCompareTo(val); console.log("yeet") }}
                            setTypeCheck={(val: number) => { setCheckType(val); console.log("yeet2") }}
                            value={compareTo}
                        /> : <></>}
                </form>
            </div>
            <div className="w-1/5 flex justify-end gap-1 pr-2 items-center">
                <Done className='fill-neutral-1000 dark:fill-darkNeutral-1000 border-neutral-300 dark:border-darkNeutral-300 h-7 w-7' />
                <Close className='fill-neutral-1000 dark:fill-darkNeutral-1000 border-neutral-300 dark:border-darkNeutral-300 h-7 w-7' />
            </div>
        </div>
    )
}

type AddPropertyCheckInputProps = {
    data: TDeviceDataObject
    value: string | number
    setTypeCheck: (val: number) => void
    setInput: (val: number | string) => void
}
function AddPropertyCheckInput(props: AddPropertyCheckInputProps) {
    useEffect(() => {
        switch (props.data.typeID) {
            case SWITCH_TYPE: {
                props.setInput(0)
                props.setTypeCheck(0)
            }
            case NUMBER_TYPE: {
                props.setInput(0)
                props.setTypeCheck(0)
            }
            case MULTI_STATE_BUTTON_TYPE: {
                props.setInput(0)
                props.setTypeCheck(0)
            }
        }
    }, [props.data])

    switch (props.data.typeID) {
        case SWITCH_TYPE: {
            return (
                <select name="checkType" id="checkType"
                    onChange={(e) => { props.setInput(Number(e.target.value)) }}>
                    <option value={1}>{props.data.onName == "" ? "on" : props.data.onName}</option>
                    <option value={0}>{props.data.offName == "" ? "off" : props.data.offName}</option>
                </select>
            )
        }
        case NUMBER_TYPE: {
            return (
                <>
                    <select name="checkType" id="checkType"
                        onChange={(e) => { props.setTypeCheck(Number(e.target.value)) }}>
                        <option value={CHECK_TYPE_EQUAL}>equal to</option>
                        <option value={CHECK_TYPE_MORE_THEN}>more then</option>
                        <option value={CHECK_TYPE_LESS_THEN}>less then</option>
                    </select>
                    <input
                        className="w-full"
                        type="number"
                        max={props.data.maxValue}
                        min={props.data.minValue}
                        step={props.data.jumpValue}
                    />
                </>
            )
        }
        case MULTI_STATE_BUTTON_TYPE: {
            <select name="checkType" id="checkType"
                onChange={(e) => { props.setInput(Number(e.target.value)) }}>
                {
                    props.data.stateList.map((element, index) => {
                        return (
                            <option key={index} value={element.stateValue}>{element.isIcon ? element.icon : element.stateTitle}</option>
                        )
                    })
                }
                {/* <option value={1}>{props.data.onName == "" ? "on" : props.data.onName}</option> */}
                {/* <option value={0}>{props.data.offName == "" ? "off" : props.data.offName}</option> */}
            </select>
        }
        default: {
            return <></>
        }
    }
}