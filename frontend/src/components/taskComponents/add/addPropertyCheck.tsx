import useGetDevices from "@/hooks/apis/devices/useGetDevices";
import useAuth from "@/hooks/useAuth";
import { MULTI_STATE_BUTTON_TYPE, NUMBER_TYPE, SWITCH_TYPE, TDevice, TDeviceDataObject } from "@/interfaces/device.interface";
import { CHECK_TYPE_EQUAL, CHECK_TYPE_LESS_THEN, CHECK_TYPE_MORE_THEN } from "@/interfaces/task.interface";
import { Close, Done } from "@mui/icons-material";
import { MouseEventHandler, useEffect, useState } from "react";
import { UseMutationResult, useQuery } from "react-query";

type TAddPropertyCheckProps = {
    updateTaskMutation: UseMutationResult<any, unknown, any[], unknown>
    onDone: () => void
    onClose: () => void
}
export function AddPropertyCheck(props: TAddPropertyCheckProps) {
    const [selectedDevice, setSelectedDevice] = useState(0);
    const [selectedProperty, setSelectedProperty] = useState(0);
    const [propertyName, setPropertyName] = useState("");
    const [checkType, setCheckType] = useState(0);
    const [compareTo, setCompareTo] = useState<number | string>("");
    const deviceQuery = useGetDevices()

    function onSubmitHandler() {
        if (!deviceQuery) return
        if (!deviceQuery.data) return
        if (!deviceQuery.data.devices[selectedDevice]) return

        props.updateTaskMutation.mutate([{
            taskPropertyName: "propertyChecks",
            operation: "add",
            deviceID: deviceQuery.data.devices[selectedDevice]._id,
            dataID: deviceQuery.data.devices[selectedDevice].data[selectedProperty].dataID,
            propertyName: propertyName,
            checkType: checkType,
            valueToCompare: compareTo
        }])

        props.onDone()
    }

    return (
        <div className="w-full flex bg-neutral-300 dark:bg-darkNeutral-300">
            <div className="w-4/5 pl-2 pt-2 pb-2 flex justify-start items-center">
                <form className="w-full flex flex-wrap gap-y-2">
                    <label htmlFor="device" className="mr-1">When </label>
                    <select name="device" id="device" className="mr-1"
                        onChange={(e) => { setSelectedDevice(Number(e.target.value)) }}>
                        {Array.isArray(deviceQuery.data?.devices) ?
                            deviceQuery.data?.devices.map((element: TDevice, index: number) => {
                                return (
                                    <option key={index} value={index}>{`${element.deviceName}`}</option>
                                )
                            }) : <></>}
                    </select>
                    <label htmlFor="property" className="mr-1">{`property`}</label>
                    <select name="property" id="property" className="mr-1"
                        onChange={(e) => { setSelectedProperty(Number(e.target.value)) }}>
                        {deviceQuery.data && deviceQuery.data.devices && deviceQuery.data.devices[selectedDevice] ?
                            deviceQuery.data.devices[selectedDevice].data.map((element: TDeviceDataObject, index: number) => {
                                return (
                                    <option key={index} value={index}>{`${element.dataTitle != "" ? element.dataTitle : `no. ${element.dataID}`}`}</option>
                                )
                            }) : <></>}
                    </select>
                    <label htmlFor="checkType" className="mr-1">is</label>
                    {deviceQuery.data && deviceQuery.data.devices && deviceQuery.data.devices[selectedDevice] ?
                        <AddPropertyCheckInput
                            data={deviceQuery.data.devices[selectedDevice].data[selectedProperty]}
                            setInput={(val: string | number) => { setCompareTo(val) }}
                            setTypeCheck={(val: number) => { setCheckType(val) }}
                            setPropertyName={(val: string) => { setPropertyName }}
                            value={compareTo}
                        /> : <></>}
                </form>
            </div>
            <div className="w-1/5 flex justify-end gap-1 pr-2 items-center">
                <Done className='fill-neutral-1000 dark:fill-darkNeutral-1000 border-neutral-300 dark:border-darkNeutral-300 h-7 w-7 cursor-pointer' onClick={onSubmitHandler} />
                <Close className='fill-neutral-1000 dark:fill-darkNeutral-1000 border-neutral-300 dark:border-darkNeutral-300 h-7 w-7 cursor-pointer' onClick={props.onClose} />
            </div>
        </div>
    )
}

type AddPropertyCheckInputProps = {
    data: TDeviceDataObject
    value: string | number
    setTypeCheck: (val: number) => void
    setInput: (val: number | string) => void
    setPropertyName: (val: string) => void
}
function AddPropertyCheckInput(props: AddPropertyCheckInputProps) {
    useEffect(() => {
        switch (props.data.typeID) {
            case SWITCH_TYPE: {
                props.setInput(0)
                props.setTypeCheck(0)
                props.setPropertyName("isOn")
            }
            case NUMBER_TYPE: {
                props.setInput(0)
                props.setTypeCheck(0)
                props.setPropertyName("currentValue")
            }
            case MULTI_STATE_BUTTON_TYPE: {
                props.setInput(0)
                props.setTypeCheck(0)
                props.setPropertyName("currentState")
            }
        }
    }, [props.data])

    switch (props.data.typeID) {
        case SWITCH_TYPE: {
            return (
                <select name="checkType" id="checkType" className="mr-1"
                    onChange={(e) => { props.setInput(Number(e.target.value)) }}>
                    <option value={0}>{props.data.offName == "" ? "off" : props.data.offName}</option>
                    <option value={1}>{props.data.onName == "" ? "on" : props.data.onName}</option>
                </select>
            )
        }
        case NUMBER_TYPE: {
            return (
                <>
                    <select name="checkType" id="checkType" className="mr-1"
                        onChange={(e) => { props.setTypeCheck(Number(e.target.value)) }}>
                        <option value={CHECK_TYPE_EQUAL}>equal to</option>
                        <option value={CHECK_TYPE_MORE_THEN}>more then</option>
                        <option value={CHECK_TYPE_LESS_THEN}>less then</option>
                    </select>
                    <input
                        className="w-full mr-1"
                        type="number"
                        max={props.data.maxValue}
                        min={props.data.minValue}
                        step={props.data.jumpValue}
                        value={props.value}
                        onChange={(e) => { props.setInput(e.target.value) }}
                    />
                </>
            )
        }
        case MULTI_STATE_BUTTON_TYPE: {
            <select name="checkType" id="checkType" className="mr-1"
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