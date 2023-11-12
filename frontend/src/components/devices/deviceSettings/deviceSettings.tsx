import { useApi } from "@/hooks/useApi"
import { useAuth } from "@/hooks/useAuth"
import { useDevice } from "@/hooks/useDevice"
import { ApiService } from "@/services/apiService"
import { DataType } from "@/services/appdataService"
import { Done } from "@mui/icons-material"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import SwitchSettings from "./types/switchSettings"

interface DeviceSettingsProps {
    uuid: string
    closeWindow: Function
}

export default function DeviceSettings(props: DeviceSettingsProps) {
    const router = useRouter()
    const [settingElements, setSettingsElements] = useState<React.ReactNode>([])
    const { fetchWithReauth } = useApi();
    const { userdata } = useAuth();
    const [device, setDeviceId] = useDevice(props.uuid);
    const [deviceName, setDeviceName] = useState("");
    const [isEditDeviceName, setIsEditDeviceName] = useState(false);

    // update state when device is loaded
    useEffect(() => {
        if (device) {
            setDeviceName(device.deviceName)
        }
    }, [device])

    //create setting for each datatype
    useEffect(() => {
        if (!device) return;

        let _settingsElements: React.ReactNode[] = []
        for (let dataAt = 0; dataAt < device.deviceData.length; dataAt++) {
            if (!device) return;
            const data = device.deviceData[dataAt];

            let newElement;
            switch (data.dataType) {
                case DataType.AIRCONDITIONER_TYPE:
                    break;
                case DataType.SWITCH_TYPE:
                    newElement = <SwitchSettings key={dataAt} dataAt={dataAt} uuid={props.uuid} />
                    break;
                default:
                    newElement = <></>;
                    break;
            }
            _settingsElements.push(newElement);
        }

        setSettingsElements(_settingsElements)
    }, [device, props])

    function handleNameChane(e: React.ChangeEvent<HTMLInputElement>) {
        e.stopPropagation()
        if (e.currentTarget.value) {
            setDeviceName(e.currentTarget.value);
        }
    }

    function handleOnEditNameClick(e: React.MouseEvent<SVGSVGElement>) {
        e.stopPropagation()
        setIsEditDeviceName(true);
    }

    function deleteDevice(e: React.MouseEvent<HTMLButtonElement>) {
        e.stopPropagation();
        let delete_path = '/device/delete_device?uuid=' + props.uuid;
        fetchWithReauth(delete_path, ApiService.REQUEST_POST, userdata.token)
        // TODO: add comfirmation massage
        props.closeWindow();
        router.push("/devices")
    }

    function forgetDevice(e: React.MouseEvent<HTMLButtonElement>) {
        e.stopPropagation();
        let body = {
            targetDevice: props.uuid,
            isAccepted: 0,
        };
        fetchWithReauth("/device/is_accepted", ApiService.REQUEST_PUT, userdata.token, body);
        // TODO: add comfirmation massage
        props.closeWindow();
        router.push("/devices")
    }

    function onSubmitNameChange(e: React.MouseEvent<SVGSVGElement>) {
        e.stopPropagation()
        let body = {
            "targetDevice": props.uuid,
            "newName": deviceName
        }
        fetchWithReauth("/device/update_name", ApiService.REQUEST_POST, userdata.token, body)
        setIsEditDeviceName(false);
    }

    return (
        <div className="w-full pl-4">
            <div className="flex items-center flex-wrap md:flex-nowrap mb-2">
                <label className="text-sm font-medium text-on-surface w-15 text-left">Device name:</label>
                <div className="w-[calc(100%-1rem)] md:w-auto flex">
                    <input type="text" value={deviceName} id="medium-input" onChange={handleNameChane} className="block w-full p-1 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    <Done className="ml-2 fill-on-surface h-8 w-8 cursor-pointer" onClick={onSubmitNameChange} />
                </div>
            </div>
            {settingElements}
            <div className="w-full flex justify-center mt-4">
                <button
                    type="button"
                    className={"outline-none flex justify-center content-center text-white ring-1 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 bg-red-500 hover:bg-red-800"}
                    onClick={forgetDevice}
                >
                    {"FORGET DEVICE"}
                </button>
            </div>            
            <div className="w-full flex justify-center mt-4">
                <button
                    type="button"
                    className={"outline-none flex justify-center content-center text-white ring-1 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 bg-red-500 hover:bg-red-800"}
                    onClick={deleteDevice}
                >
                    {"DELETE DEVICE"}
                </button>
            </div>
        </div>
    )
}