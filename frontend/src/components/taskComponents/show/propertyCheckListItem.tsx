import useGetDevice from "@/hooks/apis/devices/useGetDevice"
import { CHECK_TYPE_EQUAL, CHECK_TYPE_LESS_THEN, CHECK_TYPE_MORE_THEN, TPropertyCheck } from "@/interfaces/task.interface"
import { Delete, Edit } from "@mui/icons-material"
import { useEffect, useState } from "react"

type TPropertyCheckProps = {
    item: TPropertyCheck
    onDeleteClick: () => void
    onEditClick: () => void
}

export function PropertyCheckListItem(props: TPropertyCheckProps) {
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
                <Edit className='fill-neutral-1000 dark:fill-darkNeutral-1000 border-neutral-300 dark:border-darkNeutral-300 h-7 w-7 cursor-pointer' onClick={props.onEditClick} />
                <Delete className='fill-neutral-1000 dark:fill-darkNeutral-1000 border-neutral-300 dark:border-darkNeutral-300 h-7 w-7 cursor-pointer' onClick={props.onDeleteClick} />
            </div>
        </div>
    )
}