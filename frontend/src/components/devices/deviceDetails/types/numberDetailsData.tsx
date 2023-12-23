import { useEffect, useRef, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { useAuth } from "@/hooks/useAuth";
import { useDevice } from "@/hooks/useDevice";
import useDidMount from "@/hooks/useDidMount";
import { DeviceThermostat } from "@mui/icons-material";
import { Slider } from "@mui/material";
import { ApiService } from "@/services/apiService";
import Icon from "@/components/ui/icon";

interface props {
    targetDevice: string,
    dataAt: number,
}

export default function NumberDetailsData(props: props) {
    const { userdata } = useAuth();
    const [device, setDeviceId] = useDevice(props.targetDevice);
    const { fetchWithReauth } = useApi();
    const [value, setValue] = useState(24);
    const [commitValue, setCommitValue] = useState(false);
    const [minVal, setMinVal] = useState(0);
    const [maxVal, setMaxVal] = useState(100);
    const [symbol, setSymbol] = useState("");
    const [step, setStep] = useState(1);

    // TODO: add stops from server
    const marks = [
        {
            value: Number(minVal),
            label: String(Number(minVal))+String(symbol),
        },
        {
            value: Number(maxVal),
            label: String(Number(maxVal))+String(symbol),
        }
    ];

    function valueLabelFormat(value: number) {
        return `${value}`;
    }

    const toUpdate = useRef(false);
    useEffect(() => {
        if (!device) {
            return
        }
        setValue(device.deviceData[props.dataAt].data.number);
        setMinVal(device.deviceData[props.dataAt].data.minVal);
        setMaxVal(device.deviceData[props.dataAt].data.maxVal);
        setSymbol(device.deviceData[props.dataAt].data.symbol);
        setStep(device.deviceData[props.dataAt].data.jumpVal);
        // console.log(device.deviceData[props.dataAt].data.symbol)
    }, [device, props])

    function onTempCommitStateChange(event: React.SyntheticEvent | Event, newValue: number | Array<number>) {
        setCommitValue(!commitValue)
        toUpdate.current = true;
    }

    function onTempStateChange(event: React.SyntheticEvent | Event, newValue: number | Array<number>) {
        setValue(newValue as number)
    }

    useDidMount(() => {
        if (toUpdate.current) {
            let body = {
                targetDevice: props.targetDevice,
                dataAt: props.dataAt,
                data: {
                    number: value,
                }
            }
            fetchWithReauth("/device/update_device", ApiService.REQUEST_PUT, userdata.token, body)
            toUpdate.current = false;
        }
    }, [commitValue])

    return (
        <div className="w-full flex justify-center gap-x-2.5 items-center pb-5">
            <Icon iconName={device?.deviceData[props.dataAt].data.iconName} className="fill-on-surface h-8 w-8" />
            <div className="w-4/5 flex flex-wrap content-center justify-center gap-x-5">
                {/* TODO: add costum slider */}
                <Slider
                    value={value}
                    aria-label="Temperature"
                    defaultValue={24}
                    valueLabelDisplay="auto"
                    onChangeCommitted={onTempCommitStateChange}
                    onChange={onTempStateChange}
                    getAriaValueText={valueLabelFormat}
                    valueLabelFormat={valueLabelFormat}
                    step={step}
                    marks={marks}
                    min={minVal}
                    max={maxVal}
                    sx={{
                        color: '#3700b3',
                        '& .MuiSlider-markLabel': {
                            color: '#FFFFFF',
                        },
                    }}
                />
            </div>
        </div>
    )
}