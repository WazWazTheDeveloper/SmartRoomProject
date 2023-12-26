import { IconDropMenu } from "@/components/ui/icon";
import { useApi } from "@/hooks/useApi";
import { useAuth } from "@/hooks/useAuth";
import { useDevice } from "@/hooks/useDevice";
import { ApiService } from "@/services/apiService";
import { useEffect, useState } from "react";

interface props {
    uuid: string
    dataAt: number
}

export default function MultiStateButtonSettings(props: props) {
    const { fetchWithReauth } = useApi();
    const { userdata } = useAuth();
    const [device, setDeviceId] = useDevice(props.uuid);
    const [iconName, setIconName] = useState("");

    // update state when device is loaded
    useEffect(() => {
        if (device) {
            setIconName(device.deviceData[props.dataAt].data.iconName)
        }
    }, [device,props])

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
            
        </>
    )
}