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

export default function SwitchSettings(props: props) {
    const { fetchWithReauth } = useApi();
    const { userdata } = useAuth();
    const [device, setDeviceId] = useDevice(props.uuid);
    const [iconName, setIconName] = useState("");
    const [onName, setOnName] = useState("");
    const [offName, setOffName] = useState("");

    function sendPostRequest(data: any) {
        let body = {
            "dataAt": props.dataAt,
            "targetDevice": props.uuid,
            "data": data
        }

        let _body = Object.assign(body, data);
        fetchWithReauth("/device/update_device", ApiService.REQUEST_PUT, userdata.token, _body)
    }

    // update state when device is loaded
    useEffect(() => {
        if (device) {
            setOnName(device.deviceData[props.dataAt].data.onName)
            setOffName(device.deviceData[props.dataAt].data.offName)
            setIconName(device.deviceData[props.dataAt].data.iconName)
        }
    }, [device,props])

    function handleOnIconName(iconName: string) {
        setIconName(iconName);
        let data = {
            "data": {
                "iconName": iconName
            }
        }
        sendPostRequest(data);
    }

    function handleOnNameChange(e: React.ChangeEvent<HTMLInputElement>) {
        e.stopPropagation()
        if (e.currentTarget.value) {
            setOnName(e.currentTarget.value);
        }
    }

    function handleOffNameChange(e: React.ChangeEvent<HTMLInputElement>) {
        e.stopPropagation()
        if (e.currentTarget.value) {
            setOffName(e.currentTarget.value);
        }
    }

    function onSubmitOnNameChange(e: React.MouseEvent<SVGSVGElement>) {
        e.stopPropagation()
        let data = {
            "data": {
                "onName": onName
            }
        }
        sendPostRequest(data);
    }


    function onSubmitOffNameChange(e: React.MouseEvent<SVGSVGElement>) {
        e.stopPropagation()

        let data = {
            "data": {
                "offName": offName
            }
        }
        sendPostRequest(data);
    }

    function onSubmitOnIconName(e: React.MouseEvent<SVGSVGElement>) {
        e.stopPropagation()
        let data = {
            "data": {
                "iconName": iconName
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
                    {/* <input type="text" value={iconName} id="medium-input" onChange={handleOnIconName} className="block w-full p-1 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" /> */}
                    {/* <Done className="ml-2 fill-on-surface h-8 w-8 cursor-pointer" onClick={onSubmitOnIconName} /> */}
                </div>
            </div>
            <div className="flex items-center flex-wrap md:flex-nowrap mb-2">
                <label className="text-sm font-medium text-on-surface w-15 text-left">on text:</label>
                <div className="w-[calc(100%-1rem)] md:w-auto flex">
                    <input type="text" value={onName} id="medium-input" onChange={handleOnNameChange} className="block w-full p-1 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    <Done className="ml-2 fill-on-surface h-8 w-8 cursor-pointer" onClick={onSubmitOnNameChange} />
                </div>
            </div>
            <div className="flex items-center flex-wrap md:flex-nowrap mb-2">
                <label className="text-sm font-medium text-on-surface w-15 text-left">on text:</label>
                <div className="w-[calc(100%-1rem)] md:w-auto flex">
                    <input type="text" value={offName} id="medium-input" onChange={handleOffNameChange} className="block w-full p-1 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    <Done className="ml-2 fill-on-surface h-8 w-8 cursor-pointer" onClick={onSubmitOffNameChange} />
                </div>
            </div>
        </>
    )
}