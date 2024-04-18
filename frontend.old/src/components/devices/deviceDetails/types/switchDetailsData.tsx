import SwitchButton from "@/components/ui/switchButton";
import { useApi } from "@/hooks/useApi";
import { useAuth } from "@/hooks/useAuth";
import { useDevice } from "@/hooks/useDevice";
import useDidMount from "@/hooks/useDidMount";
import { ApiService } from "@/services/apiService";
import Icon from "@/components/ui/icon";
import { PowerSettingsNew } from "@mui/icons-material";
import { useForkRef } from "@mui/material";
import { useEffect, useRef, useState } from "react";

interface props {
    targetDevice: string,
    dataAt: number,
}

export default function SwitchDetailsData(props: props) {
    const { userdata } = useAuth();
    const [isOn, setIsOn] = useState(false);
    const [device, setDeviceId] = useDevice(props.targetDevice);
    const { fetchWithReauth } = useApi();

    const toUpdate = useRef(false);
    useEffect(() => {
        if (!device) {
            return
        }
        setIsOn(device.deviceData[props.dataAt].data.isOn);
    }, [device, props])

    useDidMount(() => {
        if (toUpdate.current) {
            let body = {
                targetDevice: props.targetDevice,
                dataAt: props.dataAt,
                data: {
                    isOn: isOn,
                }
            }
            fetchWithReauth("/device/update_device", ApiService.REQUEST_PUT, userdata.token, body)
            toUpdate.current = false;
        }
    }, [isOn])

    function onButtonStateChange(checked: boolean) {
        setIsOn(!isOn)
        toUpdate.current = true;
    }
    return (
        <div className="w-full flex justify-center gap-x-2.5 items-center pb-5">
            <Icon iconName={device?.deviceData[props.dataAt].data.iconName} className="fill-on-surface h-8 w-8" />
            <div className="w-4/5 flex flex-wrap content-center justify-center gap-x-5">
                <SwitchButton
                    state={isOn}
                    stateChangeFunction={onButtonStateChange}
                />
            </div>
        </div>
    )
}