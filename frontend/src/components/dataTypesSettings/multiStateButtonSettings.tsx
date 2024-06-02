import useGetDevice from "@/hooks/apis/devices/useGetDevice"
import usePostDeviceID from "@/hooks/apis/devices/usePostDeviceID"
import { MULTI_STATE_BUTTON_TYPE, TMultiStateButton, TStateItem } from "@/interfaces/device.interface"
import { TDeviceProperty } from "@/interfaces/deviceAPI.interface"
import { Add, Done, Edit } from "@mui/icons-material"
import { useEffect, useState } from "react"
import { UseMutationResult } from "react-query"

type TProps = {
    deviceID: string
    dataID: number
}

export default function MultiStateButtonSettings(props: TProps) {
    const [isAdd, setIsAdd] = useState(false)
    const [newStateValue, setNewStateValue] = useState(0)
    const [newIsIcon, setNewIsIcon] = useState(false)
    const [newIcon, setNewIcon] = useState("")
    const [newStateTitle, setNewStateTitle] = useState("")

    const [dataIndex, setDataIndex] = useState(0)

    const [isEditDataTitle, setIsEditDataTitle] = useState(false)
    const [newDataTitle, setNewDataTitle] = useState("")
    const [currentDataTitle, setCurrentDataTitle] = useState("")

    const updateDeviceMutation = usePostDeviceID(props.deviceID)
    const deviceQuerry = useGetDevice(props.deviceID, [updateDeviceMutation.data])

    useEffect(() => {
        if (!deviceQuerry.data?.data) return

        for (let index = 0; index < deviceQuerry.data.data.length; index++) {
            const element = deviceQuerry.data.data[index];
            if (element.dataID == props.dataID && element.typeID == 2) {
                setCurrentDataTitle(element.dataTitle)
                setDataIndex(index)
            }
        }
    }, [deviceQuerry.data])

    function onDoneEditTitleHandler() {
        updateDeviceMutation.mutate([{
            dataPropertyName: "dataTitle",
            newValue: newDataTitle,
            dataID: props.dataID,
            propertyName: "data",
            typeID: 2
        }])
        setIsEditDataTitle(false)
    }

    function onOpenEditTitleHandler() {
        if (!deviceQuerry.data?.deviceName) return

        for (let index = 0; index < deviceQuerry.data.data.length; index++) {
            const element = deviceQuerry.data.data[index];
            if (element.dataID == props.dataID) {
                setNewDataTitle(element.dataTitle)
            }
        }
        setIsEditDataTitle(true)
    }

    function onOpenAddState() {
        setIsAdd(true)
    }

    function onDoneAddState() {
        setIsAdd(false)
        updateDeviceMutation.mutate([{
            dataID:props.dataID,
            propertyName:"data",
            dataPropertyName:"stateList",
            operation:"add",
            typeID:MULTI_STATE_BUTTON_TYPE,
            newState: {
                icon: newIcon,
                isIcon:newIsIcon,
                stateTitle:newStateTitle,
                stateValue:newStateValue
            }
        }])
    }


    let data = deviceQuerry.data?.data[dataIndex] as TMultiStateButton
    return (
        <div className="flex justify-between items-center pl-2 pr-2 w-full sm:justify-center flex-wrap">
            <h2 className="text-base w-full font-bold">
                {`Data ${props.dataID}`}
            </h2>

            <div className="pl-2 flex justify-between items-center w-full sm:justify-center flex-wrap">
                <div className="w-full">
                    <h2 className="text-base w-full font-bold">
                        Data title:
                    </h2>
                    {
                        isEditDataTitle ?
                            <div className="flex justify-between items-center w-full">
                                <input
                                    className="pl-2"
                                    value={newDataTitle}
                                    onChange={(e) => { setNewDataTitle(e.target.value) }} />
                                <div>
                                    <Done className='fill-neutral-1000 dark:fill-darkNeutral-1000 border-neutral-300 dark:border-darkNeutral-300 cursor-pointer' onClick={onDoneEditTitleHandler} />
                                </div>
                            </div> :
                            <div className="flex justify-between items-center w-full">
                                <p className="pl-2">{currentDataTitle}</p>
                                <div>
                                    <Edit className='fill-neutral-1000 dark:fill-darkNeutral-1000 border-neutral-300 dark:border-darkNeutral-300 cursor-pointer' onClick={onOpenEditTitleHandler} />
                                </div>
                            </div>
                    }
                </div>
                <div className="w-full">
                    <div className="w-full flex justify-between">
                        <h2 className="text-base font-bold">
                            State list:
                        </h2>
                        <div>
                            {isAdd ?
                                <Done className='fill-neutral-1000 dark:fill-darkNeutral-1000 border-neutral-300 dark:border-darkNeutral-300 cursor-pointer' onClick={onDoneAddState}/> :
                                <Add className="w-7 h-7 fill-neutral-1000 dark:fill-darkNeutral-1000 dark:border-darkNeutral-300 border-neutral-300 cursor-pointer" onClick={onOpenAddState}/>}
                        </div>
                    </div>
                    <div className="flex justify-between items-center w-full flex-wrap">
                        {
                            isAdd ? <>
                                <div className="flex w-full">
                                    <p>{`State value: `}</p>
                                    <input
                                        className="pl-2"
                                        value={newStateValue}
                                        type="number"
                                        onChange={(e) => { setNewStateValue(Number(e.target.value)) }} />
                                </div>
                                <div className="flex w-full">
                                    <p>{`Is icon: `}</p>
                                    <select name="isIcon" id="device" className="mr-2"
                                        onChange={(e) => { setNewIsIcon(Number(e.target.value) == 1 ? true : false); console.log(e.target.value) }}
                                        value={newIsIcon ? 1 : 0}>
                                        <option value={1}>{`true`}</option>
                                        <option value={0}>{`false`}</option>
                                    </select>
                                </div>
                                <div className="flex w-full">
                                    <p>{`Icon: `}</p>
                                    <input
                                        className="pl-2"
                                        value={String(newIcon)}
                                        onChange={(e) => { setNewIcon(e.target.value) }} />
                                </div>
                                <div className="flex w-full">
                                    <p>{`State title: `}</p>
                                    <input
                                        className="pl-2"
                                        value={String(newStateTitle)}
                                        onChange={(e) => { setNewStateTitle(e.target.value) }} />
                                </div>
                            </> : <></>
                        }
                        {
                            (data && data.typeID == MULTI_STATE_BUTTON_TYPE && data.stateList) ?
                                data.stateList.map((element, index) => {
                                    return (
                                        <ListItem key={index} element={element} updateDeviceMutation={updateDeviceMutation} dataID={props.dataID} deviceID={props.deviceID} />
                                    )
                                }) : <></>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

type TListItemProps = {
    updateDeviceMutation: UseMutationResult<any, unknown, TDeviceProperty[], unknown>
    element: TStateItem
    deviceID: string
    dataID: number
}

function ListItem(props: TListItemProps) {
    const [isEdit, setIsEdit] = useState(false)

    const [newStateValue, setNewStateValue] = useState(0)
    const [newIsIcon, setNewIsIcon] = useState(false)
    const [newIcon, setNewIcon] = useState("")
    const [newStateTitle, setNewStateTitle] = useState("")

    function onOpenEdit() {
        console.log("asdasdasd")
        setNewStateValue(props.element.stateValue)
        setNewIsIcon(props.element.isIcon)
        setNewIcon(props.element.icon)
        setNewStateTitle(props.element.stateTitle)
        setIsEdit(true)
    }

    function onDoneEdit() {
        props.updateDeviceMutation.mutate([{
            dataID: props.dataID,
            typeID: MULTI_STATE_BUTTON_TYPE,
            dataPropertyName: "stateList",
            operation: "update",
            propertyName: "data",
            state: {
                stateValue: newStateValue,
                isIcon: newIsIcon,
                icon: newIcon,
                stateTitle: newStateTitle,
            }
        }])
        setIsEdit(false)
    }

    return (
        <div className="flex flex-wrap justify-center pt-2 pl-2 w-full">
            <div className="w-11/12 border-t border-neutral-500 dark:border-darkNeutral-500" />
            <div className="flex justify-end items-center w-full">
                {
                    isEdit ?
                        <Done className='fill-neutral-1000 dark:fill-darkNeutral-1000 border-neutral-300 dark:border-darkNeutral-300 cursor-pointer' onClick={onDoneEdit} /> :
                        <Edit className='fill-neutral-1000 dark:fill-darkNeutral-1000 border-neutral-300 dark:border-darkNeutral-300 cursor-pointer' onClick={onOpenEdit} />
                }
            </div>
            <div className="flex justify-between items-center w-full flex-wrap">
                {
                    isEdit ? <>
                        <div className="flex w-full">
                            <p>{`State value: `}</p>
                            <input
                                className="pl-2"
                                value={newStateValue}
                                type="number"
                                onChange={(e) => { setNewStateValue(Number(e.target.value)) }} />
                        </div>
                        <div className="flex w-full">
                            <p>{`Is icon: `}</p>
                            <select name="isIcon" id="device" className="mr-2"
                                onChange={(e) => { setNewIsIcon(Number(e.target.value) == 1 ? true : false); console.log(e.target.value) }}
                                value={newIsIcon ? 1 : 0}>
                                <option value={1}>{`true`}</option>
                                <option value={0}>{`false`}</option>
                            </select>
                        </div>
                        <div className="flex w-full">
                            <p>{`Icon: `}</p>
                            <input
                                className="pl-2"
                                value={String(newIcon)}
                                onChange={(e) => { setNewIcon(e.target.value) }} />
                        </div>
                        <div className="flex w-full">
                            <p>{`State title: `}</p>
                            <input
                                className="pl-2"
                                value={String(newStateTitle)}
                                onChange={(e) => { setNewStateTitle(e.target.value) }} />
                        </div>
                    </> : <>
                        <p className="w-full">{`State value: ${props.element.stateValue}`}</p>
                        <p className="w-full">{`Is icon: ${props.element.isIcon}`}</p>
                        <p className="w-full">{`Icon: ${props.element.icon}`}</p>
                        <p className="w-full">{`State title: ${props.element.stateTitle}`}</p>
                    </>
                }
            </div>
        </div>
    )
}