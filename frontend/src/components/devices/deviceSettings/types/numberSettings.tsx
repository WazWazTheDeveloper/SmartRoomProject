import { IconDropMenu } from "@/components/ui/icon";
import { useApi } from "@/hooks/useApi";
import { useAuth } from "@/hooks/useAuth";
import { useDevice } from "@/hooks/useDevice";
import { ApiService } from "@/services/apiService";
import { Done } from "@mui/icons-material";
import { useEffect, useState } from "react";

interface props {
    uuid: string
    dataAt: number
}

export default function NumberSettings(props: props) {
    const { fetchWithReauth } = useApi();
    const { userdata } = useAuth();
    const [device, setDeviceId] = useDevice(props.uuid);
    const [minVal, setMinVal] = useState(0);
    const [maxVal, setMaxVal] = useState(100);
    const [jumpVal, setJumpVal] = useState(1);
    const [iconName, setIconName] = useState("");

    // update state when device is loaded
    useEffect(() => {
        if (device) {
            setIconName(device.deviceData[props.dataAt].data.iconName)
            setMinVal(device.deviceData[props.dataAt].data.minVal)
            setMaxVal(device.deviceData[props.dataAt].data.maxVal)
            setJumpVal(device.deviceData[props.dataAt].data.jumpVal)
        }
    }, [device])

    function sendPostRequest(data: any) {
        let body = {
            "dataAt": props.dataAt,
            "targetDevice": props.uuid,
            "data": data
        }

        let _body = Object.assign(body, data);
        fetchWithReauth("/device/update_device", ApiService.REQUEST_PUT, userdata.token, _body)
    }

    function handleOnIconName(iconName: string) {
        setIconName(iconName);
        let data = {
            "data": {
                "iconName": iconName
            }
        }
        sendPostRequest(data);
    }

    function handleOnMinValChange(e: React.ChangeEvent<HTMLInputElement>) {
        e.stopPropagation()
        if (e.currentTarget.value && !isNaN(Number(e.currentTarget.value))) {
            setMinVal(Number(e.currentTarget.value));
        }
    }

    function onSubmitMinVal(e: React.MouseEvent<SVGSVGElement>) {
        e.stopPropagation()
        let data = {
            "data": {
                "minVal": minVal
            }
        }
        sendPostRequest(data);
    }

    function handleOnMaxValChange(e: React.ChangeEvent<HTMLInputElement>) {
        e.stopPropagation()
        if (e.currentTarget.value && !isNaN(Number(e.currentTarget.value))) {
            setMaxVal(Number(e.currentTarget.value));
        }
    }

    function onSubmitMaxVal(e: React.MouseEvent<SVGSVGElement>) {
        e.stopPropagation()
        let data = {
            "data": {
                "maxVal": maxVal
            }
        }
        sendPostRequest(data);
    }

    function handleOnJumpValChange(e: React.ChangeEvent<HTMLInputElement>) {
        e.stopPropagation()
        if (e.currentTarget.value && !isNaN(Number(e.currentTarget.value))) {
            setJumpVal(Number(e.currentTarget.value));
        }
    }

    function onSubmitJumpVal(e: React.MouseEvent<SVGSVGElement>) {
        e.stopPropagation()
        let data = {
            "data": {
                "jumpVal": jumpVal
            }
        }
        sendPostRequest(data);
    }

    return (
        <>
            <div className="flex items-center flex-wrap md:flex-nowrap mb-1 border-white">
                <label className="text-sm font-medium text-on-surface w-15 text-left border-t">{`data at ${props.dataAt}`}</label>
            </div>
            <div className="flex items-center flex-wrap md:flex-nowrap mb-2">
                <label className="text-sm font-medium text-on-surface w-15 text-left">icon:</label>
                <div className="w-[calc(100%-1rem)] md:w-auto flex">
                    <IconDropMenu onChange={handleOnIconName} currentIcon={iconName} />
                </div>
            </div>
            <div className="flex items-center flex-wrap md:flex-nowrap mb-2">
                <label className="text-sm font-medium text-on-surface w-15 text-left">minVal:</label>
                <div className="w-[calc(100%-1rem)] md:w-auto flex">
                    <input type="text" value={minVal} id="medium-input" onChange={handleOnMinValChange} className="block w-full p-1 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    <Done className="ml-2 fill-on-surface h-8 w-8 cursor-pointer" onClick={onSubmitMinVal} />
                </div>
            </div>
            <div className="flex items-center flex-wrap md:flex-nowrap mb-2">
                <label className="text-sm font-medium text-on-surface w-15 text-left">maxVal:</label>
                <div className="w-[calc(100%-1rem)] md:w-auto flex">
                    <input type="text" value={maxVal} id="medium-input" onChange={handleOnMaxValChange} className="block w-full p-1 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    <Done className="ml-2 fill-on-surface h-8 w-8 cursor-pointer" onClick={onSubmitMaxVal} />
                </div>
            </div>
            <div className="flex items-center flex-wrap md:flex-nowrap mb-2">
                <label className="text-sm font-medium text-on-surface w-15 text-left">jumpVal:</label>
                <div className="w-[calc(100%-1rem)] md:w-auto flex">
                    <input type="text" value={jumpVal} id="medium-input" onChange={handleOnJumpValChange} className="block w-full p-1 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    <Done className="ml-2 fill-on-surface h-8 w-8 cursor-pointer" onClick={onSubmitJumpVal} />
                </div>
            </div>
        </>
    )
}