import useGetDevice from "@/hooks/apis/devices/useGetDevice"
import usePostDeviceID from "@/hooks/apis/devices/usePostDeviceID"
import { Add, Done, Edit } from "@mui/icons-material"
import { useEffect, useState } from "react"

type TProps = {
    deviceID: string
    dataID: number
}

export default function MultiStateButtonSettings(props: TProps) {
    const [isEditDataTitle, setIsEditDataTitle] = useState(false)
    const [newDataTitle, setNewDataTitle] = useState("")
    const [currentDataTitle, setCurrentDataTitle] = useState("")

    const updateDeviceMutation = usePostDeviceID(props.deviceID)
    const deviceQuerry = useGetDevice(props.deviceID, [updateDeviceMutation.data])

    useEffect(() => {
        if (!deviceQuerry.data?.data) return

        for (let index = 0; index < deviceQuerry.data.data.length; index++) {
            const element = deviceQuerry.data.data[index];
            if (element.dataID == props.dataID && element.typeID == 0) {
                setCurrentDataTitle(element.dataTitle)
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


    //@ts-ignore
    let x = deviceQuerry.data?.data ? deviceQuerry.data?.data[3].stateList[0] : ""
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
                        <Add className="w-7 h-7 fill-neutral-1000 dark:fill-darkNeutral-1000 dark:border-darkNeutral-300 border-neutral-300 cursor-pointer" />
                    </div>
                    <div className="flex justify-between items-center w-full flex-wrap">
                        <div className="border border-red-50 border-t-solid">
                            <p className="w-full">{`state value: ${x.stateValue}`}</p>
                            <p className="w-full">{`state value: ${x.stateValue}`}</p>
                            <p className="w-full">{`state value: ${x.stateValue}`}</p>
                            <p className="w-full">{`state value: ${x.stateValue}`}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}