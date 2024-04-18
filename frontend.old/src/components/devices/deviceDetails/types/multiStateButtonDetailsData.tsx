import Button from "@/components/ui/button";
import SwitchButton from "@/components/ui/switchButton";
import { useApi } from "@/hooks/useApi";
import { useAuth } from "@/hooks/useAuth";
import { useDevice } from "@/hooks/useDevice";
import useDidMount from "@/hooks/useDidMount";
import { ApiService } from "@/services/apiService";
import Icon from "@/components/ui/icon";
import { AcUnit, FastForward } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";

interface props {
    targetDevice: string,
    dataAt: number,
}

export default function MultiStateButtonDetailsData(props: props) {
    const { userdata } = useAuth();
    const [state, setState] = useState(0);
    const [device, setDeviceId] = useDevice(props.targetDevice);
    const { fetchWithReauth } = useApi();

    const toUpdate = useRef(false);

    function onStateChange(newState: number) {
        setState(newState)
        toUpdate.current = true;
    }

    useEffect(() => {
        if (!device) {
            return
        }
        setState(device.deviceData[props.dataAt].data.currentState);
    }, [device, props])

    useDidMount(() => {
        if (toUpdate.current) {
            let body = {
                targetDevice: props.targetDevice,
                dataAt: props.dataAt,
                data: {
                    currentState: state,
                }
            }
            fetchWithReauth("/device/update_device", ApiService.REQUEST_PUT, userdata.token, body)
            toUpdate.current = false;
        }
    }, [state])
    
    return (
        <div className="w-full flex justify-center gap-x-2.5 items-center pb-5">
            <Icon iconName={device?.deviceData[props.dataAt].data.iconName} className="fill-on-surface h-8 w-8" />
            <div className="w-4/5 flex flex-wrap content-center justify-center gap-x-5">
                {device?.deviceData[props.dataAt].data.stateList.map((stateItem: any, index: number) => {
                    let _state = device?.deviceData[props.dataAt].data.stateList[index].stateNumber
                    return (
                        <Button key={index} isFocused={state == stateItem.stateNumber} className="h-10 min-w-16 md:min-w-20" onClick={() => { onStateChange(_state) }}>
                            {stateItem.isIcon ? <Icon iconName={stateItem.icon} /> : stateItem.string}
                        </Button>
                    )
                })}
            </div>
        </div>
    )
}