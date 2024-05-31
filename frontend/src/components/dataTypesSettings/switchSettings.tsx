import useGetDevice from "@/hooks/apis/devices/useGetDevice"
import usePostDeviceID from "@/hooks/apis/devices/usePostDeviceID"
import { Done, Edit } from "@mui/icons-material"
import { useEffect, useState } from "react"

type TProps = {
    deviceID: string
    dataID: number
}

export default function SwitchSettings(props: TProps) {
    const [isEditDataTitle, setIsEditDataTitle] = useState(false)
    const [newDataTitle, setNewDataTitle] = useState("")
    const [currentDataTitle, setCurrentDataTitle] = useState("")

    const [isEditOnName, setIsEditOnName] = useState(false)
    const [newOnName, setNewOnName] = useState("")
    const [currentOnName, setCurrentOnName] = useState("")

    const [isEditOffName, setIsEditOffName] = useState(false)
    const [newOffName, setNewOffName] = useState("")
    const [currentOffName, setCurrentOffName] = useState("")


    const updateDeviceMutation = usePostDeviceID(props.deviceID)
    const deviceQuerry = useGetDevice(props.deviceID, [updateDeviceMutation.data])

    useEffect(() => {
        if (!deviceQuerry.data?.data) return

        for (let index = 0; index < deviceQuerry.data.data.length; index++) {
            const element = deviceQuerry.data.data[index];
            if (element.dataID == props.dataID && element.typeID == 0) {
                setCurrentDataTitle(element.dataTitle)
                setCurrentOnName(element.onName)
                setCurrentOffName(element.offName)
            }
        }
    }, [deviceQuerry.data])
    function onDoneEditTitleHandler() {
        updateDeviceMutation.mutate([{
            dataPropertyName: "dataTitle",
            newValue: newDataTitle,
            dataID: props.dataID,
            propertyName: "data",
            typeID: 0
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

    function onDoneEditOnNameHandler() {
        updateDeviceMutation.mutate([{
            dataPropertyName: "onName",
            newValue: newOnName,
            dataID: props.dataID,
            propertyName: "data",
            typeID: 0
        }])
        setIsEditOnName(false)
    }

    function onOpenEditOnNameHandler() {
        if (!deviceQuerry.data?.deviceName) return

        for (let index = 0; index < deviceQuerry.data.data.length; index++) {
            const element = deviceQuerry.data.data[index];
            if (element.dataID == props.dataID && element.typeID == 0) {
                setNewOnName(element.onName)
            }
        }
        setIsEditOnName(true)
    }

    function onDoneEditOffNameHandler() {
        updateDeviceMutation.mutate([{
            dataPropertyName: "offName",
            newValue: newOffName,
            dataID: props.dataID,
            propertyName: "data",
            typeID: 0
        }])
        setIsEditOffName(false)
    }

    function onOpenEditOffNameHandler() {
        if (!deviceQuerry.data?.deviceName) return

        for (let index = 0; index < deviceQuerry.data.data.length; index++) {
            const element = deviceQuerry.data.data[index];
            if (element.dataID == props.dataID && element.typeID == 0) {
                setNewOffName(element.offName)
            }
        }
        setIsEditOffName(true)
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
                        On name:
                    </h2>
                    {
                        isEditOnName ?
                            <div className="flex justify-between items-center w-full">
                                <input
                                    className="pl-2"
                                    value={newOnName}
                                    onChange={(e) => { setNewOnName(e.target.value) }} />
                                <div>
                                    <Done className='fill-neutral-1000 dark:fill-darkNeutral-1000 border-neutral-300 dark:border-darkNeutral-300 cursor-pointer' onClick={onDoneEditOnNameHandler} />
                                </div>
                            </div> :
                            <div className="flex justify-between items-center w-full">
                                <p className="pl-2">{currentOnName}</p>
                                <div>
                                    <Edit className='fill-neutral-1000 dark:fill-darkNeutral-1000 border-neutral-300 dark:border-darkNeutral-300 cursor-pointer' onClick={onOpenEditOnNameHandler} />
                                </div>
                            </div>
                    }
                </div>
                <div className="w-full">
                    <h2 className="text-base w-full font-bold">
                        Off name:
                    </h2>
                    {
                        isEditOffName ?
                            <div className="flex justify-between items-center w-full">
                                <input
                                    className="pl-2"
                                    value={newOffName}
                                    onChange={(e) => { setNewOffName(e.target.value) }} />
                                <div>
                                    <Done className='fill-neutral-1000 dark:fill-darkNeutral-1000 border-neutral-300 dark:border-darkNeutral-300 cursor-pointer' onClick={onDoneEditOffNameHandler} />
                                </div>
                            </div> :
                            <div className="flex justify-between items-center w-full">
                                <p className="pl-2">{currentOffName}</p>
                                <div>
                                    <Edit className='fill-neutral-1000 dark:fill-darkNeutral-1000 border-neutral-300 dark:border-darkNeutral-300 cursor-pointer' onClick={onOpenEditOffNameHandler} />
                                </div>
                            </div>
                    }
                </div>
            </div>
        </div>
    )
}