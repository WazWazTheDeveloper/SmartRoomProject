import useGetDevice from "@/hooks/apis/devices/useGetDevice"
import usePostDeviceID from "@/hooks/apis/devices/usePostDeviceID"
import { NUMBER_TYPE } from "@/interfaces/device.interface"
import { Done, Edit } from "@mui/icons-material"
import { useEffect, useState } from "react"

type TProps = {
    deviceID: string
    dataID: number
}

export default function NumberSettings(props: TProps) {
    const [isEditDataTitle, setIsEditDataTitle] = useState(false)
    const [newDataTitle, setNewDataTitle] = useState("")
    const [currentDataTitle, setCurrentDataTitle] = useState("")

    const [isEditMinValue, setIsEditMinValue] = useState(false)
    const [newMinValue, setNewMinValue] = useState(0)
    const [currentMinValue, setCurrentMinValue] = useState(0)


    const [isEditMaxValue, setIsEditMaxValue] = useState(false)
    const [newMaxValue, setNewMaxValue] = useState(100)
    const [currentMaxValue, setCurrentMaxValue] = useState(100)

    const [isEditJumpValue, setIsEditJumpValue] = useState(false)
    const [newJumpValue, setNewJumpValue] = useState(0)
    const [currentJumpValue, setCurrentJumpValue] = useState(1)

    const [isEditSymbolValue, setIsEditSymbolValue] = useState(false)
    const [newSymbolValue, setNewSymbolValue] = useState("")
    const [currentSymbolValue, setCurrentSymbolValue] = useState("")

    const updateDeviceMutation = usePostDeviceID(props.deviceID)
    const deviceQuerry = useGetDevice(props.deviceID, [updateDeviceMutation.data])

    useEffect(() => {
        if (!deviceQuerry.data?.data) return

        for (let index = 0; index < deviceQuerry.data.data.length; index++) {
            const element = deviceQuerry.data.data[index];
            if (element.dataID == props.dataID && element.typeID == 1) {
                setCurrentDataTitle(element.dataTitle)
                setCurrentMinValue(element.minValue)
                setCurrentMaxValue(element.maxValue)
                setCurrentJumpValue(element.jumpValue)
                setCurrentSymbolValue(element.symbol)
            }
        }
    }, [deviceQuerry.data])
    function onDoneEditTitleHandler() {
        updateDeviceMutation.mutate([{
            dataPropertyName: "dataTitle",
            newValue: newDataTitle,
            dataID: props.dataID,
            propertyName: "data",
            typeID: NUMBER_TYPE
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

    function onDoneEditMinValueHandler() {
        updateDeviceMutation.mutate([{
            dataPropertyName: "minValue",
            newValue: newMinValue,
            dataID: props.dataID,
            propertyName: "data",
            typeID: 1
        }])
        setIsEditMinValue(false)
    }

    function onOpenEditMinValueHandler() {
        if (!deviceQuerry.data?.deviceName) return

        for (let index = 0; index < deviceQuerry.data.data.length; index++) {
            const element = deviceQuerry.data.data[index];
            if (element.dataID == props.dataID && element.typeID == 1) {
                setNewMinValue(element.minValue)
            }
        }
        setIsEditMinValue(true)
    }

    function onDoneEditMaxValueHandler() {
        updateDeviceMutation.mutate([{
            dataPropertyName: "maxValue",
            newValue: newMaxValue,
            dataID: props.dataID,
            propertyName: "data",
            typeID: 1
        }])
        setIsEditMaxValue(false)
    }

    function onOpenEditMaxValueHandler() {
        if (!deviceQuerry.data?.deviceName) return

        for (let index = 0; index < deviceQuerry.data.data.length; index++) {
            const element = deviceQuerry.data.data[index];
            if (element.dataID == props.dataID && element.typeID == 1) {
                setNewMaxValue(element.maxValue)
            }
        }
        setIsEditMaxValue(true)
    }

    function onDoneEditJumpValueHandler() {
        updateDeviceMutation.mutate([{
            dataPropertyName: "jumpValue",
            newValue: newJumpValue,
            dataID: props.dataID,
            propertyName: "data",
            typeID: 1
        }])
        setIsEditJumpValue(false)
    }

    function onOpenEditJumpValueHandler() {
        if (!deviceQuerry.data?.deviceName) return

        for (let index = 0; index < deviceQuerry.data.data.length; index++) {
            const element = deviceQuerry.data.data[index];
            if (element.dataID == props.dataID && element.typeID == 1) {
                setNewJumpValue(element.jumpValue)
            }
        }
        setIsEditJumpValue(true)
    }

    function onDoneEditSymbolValueHandler() {
        updateDeviceMutation.mutate([{
            dataPropertyName: "symbol",
            newValue: newSymbolValue,
            dataID: props.dataID,
            propertyName: "data",
            typeID: 1
        }])
        setIsEditSymbolValue(false)
    }

    function onOpenEditSymbolValueHandler() {
        if (!deviceQuerry.data?.deviceName) return

        for (let index = 0; index < deviceQuerry.data.data.length; index++) {
            const element = deviceQuerry.data.data[index];
            if (element.dataID == props.dataID && element.typeID == 1) {
                setNewSymbolValue(element.symbol)
            }
        }
        setIsEditSymbolValue(true)
    }

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
                    <h2 className="text-base w-full font-bold">
                        Min value
                    </h2>
                    {
                        isEditMinValue ?
                            <div className="flex justify-between items-center w-full">
                                <input
                                    className="pl-2"
                                    value={newMinValue}
                                    type="number"
                                    onChange={(e) => { setNewMinValue(Number(e.target.value)) }} />
                                <div>
                                    <Done className='fill-neutral-1000 dark:fill-darkNeutral-1000 border-neutral-300 dark:border-darkNeutral-300 cursor-pointer' onClick={onDoneEditMinValueHandler} />
                                </div>
                            </div> :
                            <div className="flex justify-between items-center w-full">
                                <p className="pl-2">{currentMinValue}</p>
                                <div>
                                    <Edit className='fill-neutral-1000 dark:fill-darkNeutral-1000 border-neutral-300 dark:border-darkNeutral-300 cursor-pointer' onClick={onOpenEditMinValueHandler} />
                                </div>
                            </div>
                    }
                </div>
                <div className="w-full">
                    <h2 className="text-base w-full font-bold">
                        Max value
                    </h2>
                    {
                        isEditMaxValue ?
                            <div className="flex justify-between items-center w-full">
                                <input
                                    className="pl-2"
                                    value={newMaxValue}
                                    type="number"
                                    onChange={(e) => { setNewMaxValue(Number(e.target.value)) }} />
                                <div>
                                    <Done className='fill-neutral-1000 dark:fill-darkNeutral-1000 border-neutral-300 dark:border-darkNeutral-300 cursor-pointer' onClick={onDoneEditMaxValueHandler} />
                                </div>
                            </div> :
                            <div className="flex justify-between items-center w-full">
                                <p className="pl-2">{currentMaxValue}</p>
                                <div>
                                    <Edit className='fill-neutral-1000 dark:fill-darkNeutral-1000 border-neutral-300 dark:border-darkNeutral-300 cursor-pointer' onClick={onOpenEditMaxValueHandler} />
                                </div>
                            </div>
                    }
                </div>
                <div className="w-full">
                    <h2 className="text-base w-full font-bold">
                        Jump value
                    </h2>
                    {
                        isEditJumpValue ?
                            <div className="flex justify-between items-center w-full">
                                <input
                                    className="pl-2"
                                    value={newJumpValue}
                                    type="number"
                                    onChange={(e) => { setNewJumpValue(Number(e.target.value)) }} />
                                <div>
                                    <Done className='fill-neutral-1000 dark:fill-darkNeutral-1000 border-neutral-300 dark:border-darkNeutral-300 cursor-pointer' onClick={onDoneEditJumpValueHandler} />
                                </div>
                            </div> :
                            <div className="flex justify-between items-center w-full">
                                <p className="pl-2">{currentJumpValue}</p>
                                <div>
                                    <Edit className='fill-neutral-1000 dark:fill-darkNeutral-1000 border-neutral-300 dark:border-darkNeutral-300 cursor-pointer' onClick={onOpenEditJumpValueHandler} />
                                </div>
                            </div>
                    }
                </div>
                <div className="w-full">
                    <h2 className="text-base w-full font-bold">
                        Symbol
                    </h2>
                    {
                        isEditSymbolValue ?
                            <div className="flex justify-between items-center w-full">
                                <input
                                    className="pl-2"
                                    value={newSymbolValue}
                                    onChange={(e) => { setNewSymbolValue(e.target.value) }} />
                                <div>
                                    <Done className='fill-neutral-1000 dark:fill-darkNeutral-1000 border-neutral-300 dark:border-darkNeutral-300 cursor-pointer' onClick={onDoneEditSymbolValueHandler} />
                                </div>
                            </div> :
                            <div className="flex justify-between items-center w-full">
                                <p className="pl-2">{currentSymbolValue}</p>
                                <div>
                                    <Edit className='fill-neutral-1000 dark:fill-darkNeutral-1000 border-neutral-300 dark:border-darkNeutral-300 cursor-pointer' onClick={onOpenEditSymbolValueHandler} />
                                </div>
                            </div>
                    }
                </div>
            </div>
        </div>
    )
}