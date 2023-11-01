import Button from "@/components/ui/button";
import SwitchButton from "@/components/ui/switchButton";
import { useApi } from "@/hooks/useApi";
import { useAuth } from "@/hooks/useAuth";
import useDidMount from "@/hooks/useDidMount";
import { ApiService } from "@/services/apiService";
import { AcUnit, Air, AirlineSeatFlatAngled, DeviceThermostat, Dry, EmojiEmotions, FastForward, Favorite, HdrAuto, LocalFireDepartment, PowerSettingsNew, Swipe, SwipeVertical, Timer } from "@mui/icons-material";
import { Slider } from "@mui/material";
import { useEffect, useRef, useState } from "react";


// TODO: make this come from the server
const marks = [
    {
        value: 16,
        label: '16°C',
    },
    {
        value: 20,
        label: '20°C',
    },
    {
        value: 27,
        label: '27°C',
    },
    {
        value: 32,
        label: '32°C',
    },
];

function valueLabelFormat(value: number) {
    return `${value}°C`;
}

interface props {
    targetDevice: string,
    dataAt: number,
    data: {
        isOn: boolean
        temp: number
        mode: number
        speed: number
        swing1: boolean
        swing2: boolean
        timer: number
        isStrong: boolean
        isFeeling: boolean
        isSleep: boolean
        isScreen: boolean
        isHealth: boolean
    }
}

export default function AirconditionerDetailsData(props: props) {
    const deviceData = props.data
    console.log()
    const { userdata } = useAuth();
    const { data, isLoading, isError, error, fetchWithReauth } = useApi();
    const [isOn, setIsOn] = useState(deviceData.isOn as boolean);
    const [temp, setTemp] = useState(deviceData.temp);
    const [tempCommit, setTempCommit] = useState(false);
    const [mode, setMode] = useState(deviceData.mode);
    const [speed, setSpeed] = useState(deviceData.speed);
    const [swing1, setSwing1] = useState(deviceData.swing1 as boolean);
    const [swing2, setSwing2] = useState(deviceData.swing2 as boolean);
    const [timer, setTimer] = useState(deviceData.timer);
    const [isStrong, setIsStrong] = useState(deviceData.isStrong as boolean);
    const [isFeeling, setIsFeeling] = useState(deviceData.isFeeling as boolean);
    const [isSleep, setIsSleep] = useState(deviceData.isSleep as boolean);
    const [isHealth, setIsHealth] = useState(deviceData.isHealth as boolean);

    const toUpdate = useRef(false);

    useEffect(() => {
        setIsOn(deviceData.isOn);
        setTemp(deviceData.temp);
        setMode(deviceData.mode);
        setSpeed(deviceData.speed);
        setSwing1(deviceData.swing1);
        setSwing2(deviceData.swing2);
        setTimer(deviceData.timer);
        setIsStrong(deviceData.isStrong);
        setIsFeeling(deviceData.isFeeling);
        setIsSleep(deviceData.isSleep);
        setIsHealth(deviceData.isHealth);
    }, [deviceData])

    useDidMount(() => {
        if (toUpdate.current) {
            let body = {
                targetDevice: props.targetDevice,
                dataAt: props.dataAt,
                data: {
                    isOn: isOn,
                    temp: temp,
                    mode: mode,
                    speed: speed,
                    swing1: swing1,
                    swing2: swing2,
                    timer: timer,
                    isStrong: isStrong,
                    isFeeling: isFeeling,
                    isSleep: isSleep,
                    isHealth: isHealth,
                }
            }
            fetchWithReauth("/device/update_device", ApiService.REQUEST_POST, userdata.token, body)
            toUpdate.current = false;
        }
    }, [isOn, tempCommit, mode, speed, swing1, swing2, timer, isStrong, isFeeling, isSleep, isHealth])

    function onButtonStateChange(checked: boolean) {
        setIsOn(!isOn)
        toUpdate.current = true;
    }
    function onSwing1StateChange(e: boolean) {
        setSwing1(!swing1)
        toUpdate.current = true;
    }
    function onSwing2StateChange(e: boolean) {
        setSwing2(!swing2)
        toUpdate.current = true;
    }
    function onIsStrongStateChange(e: React.MouseEvent<HTMLElement>) {
        setIsStrong(!isStrong)
        toUpdate.current = true;
    }
    function onIsFeelingStateChange(e: boolean) {
        setIsFeeling(!isFeeling)
        toUpdate.current = true;
    }
    function onIsSleepStateChange(e: boolean) {
        setIsSleep(!isSleep)
        toUpdate.current = true;
    }
    function onIsHealthStateChange(e: boolean) {
        setIsHealth(!isHealth)
        toUpdate.current = true;
    }
    function onTempCommitStateChange(event: React.SyntheticEvent | Event, newValue: number | Array<number>) {
        setTempCommit(!tempCommit)
        toUpdate.current = true;
    }
    function onTempStateChange(event: React.SyntheticEvent | Event, newValue: number | Array<number>) {
        setTemp(newValue as number)
    }
    function onModeStateChange(newMode: number) {
        setMode(newMode)
        toUpdate.current = true;
    }
    function onSpeedStateChange(newMode: number) {
        setSpeed(newMode)
        toUpdate.current = true;
    }

    return (
        <>
            <div className="w-full flex justify-center gap-x-2.5 items-center">
                <PowerSettingsNew className="fill-on-surface h-8 w-8" />
                <div className="w-4/5 flex flex-wrap content-center justify-center gap-x-5">
                    <SwitchButton
                        state={isOn}
                        stateChangeFunction={onButtonStateChange}
                    />
                </div>
            </div>
            <div className="w-full flex justify-center gap-x-2.5 items-center">
                <DeviceThermostat className="fill-on-surface h-8 w-8" />
                <div className="w-4/5 flex flex-wrap content-center justify-center gap-x-5">
                    {/* TODO: add costum slider */}
                    <Slider
                        value={temp}
                        aria-label="Temperature"
                        defaultValue={24}
                        valueLabelDisplay="auto"
                        onChangeCommitted={onTempCommitStateChange}
                        onChange={onTempStateChange}
                        // getAriaValueText={valueLabelFormat}
                        valueLabelFormat={valueLabelFormat}
                        marks={marks}
                        min={16}
                        max={32}
                        sx={{
                            color: '#3700b3',
                            '& .MuiSlider-markLabel': {
                                color: '#FFFFFF',
                            },
                        }}
                    />
                </div>
            </div>
            <div className="w-full flex justify-center gap-x-2.5 items-center">
                <FastForward className="fill-on-surface h-8 w-8" />
                <div className="w-4/5 flex flex-wrap content-center justify-center gap-x-5">
                    <Button isFocused={mode === 1} className="h-10 w-16 md:w-20" onClick={() => { onModeStateChange(1) }}>
                        <AcUnit />
                    </Button>
                    <Button isFocused={mode === 3} className="h-10 w-16 md:w-20" onClick={() => { onModeStateChange(3) }}>
                        <LocalFireDepartment />
                    </Button>
                    <Button isFocused={mode === 4} className="h-10 w-16 md:w-20" onClick={() => { onModeStateChange(4) }}>
                        <Air />
                    </Button>
                    <Button isFocused={mode === 2} className="h-10 w-16 md:w-20" onClick={() => { onModeStateChange(2) }}>
                        <Dry />
                    </Button>
                    <Button isFocused={mode === 0} className="h-10 w-16 md:w-20" onClick={() => { onModeStateChange(0) }}>
                        <HdrAuto />
                    </Button>
                </div>
            </div>
            <div className="w-full flex justify-center gap-x-2.5 items-center">
                <FastForward className="fill-on-surface h-8 w-8" />
                <div className="w-4/5 flex flex-wrap content-center justify-center gap-x-5">
                    <Button isFocused={speed === 0} className="h-10 w-16 md:w-20" onClick={() => { onSpeedStateChange(0) }}>
                        I
                    </Button>
                    <Button isFocused={speed === 1} className="h-10 w-16 md:w-20" onClick={() => { onSpeedStateChange(1) }}>
                        II
                    </Button>
                    <Button isFocused={speed === 2} className="h-10 w-16 md:w-20" onClick={() => { onSpeedStateChange(2) }}>
                        III
                    </Button>

                    <Button isFocused={isStrong} className="h-10 w-16 md:w-20" onClick={onIsStrongStateChange}>
                        Strong
                    </Button>
                    <Button isFocused={speed === 3} className="h-10 w-16 md:w-20" onClick={() => { onSpeedStateChange(3) }}>
                        AUTO
                    </Button>
                </div>
            </div>
            <div className="w-full flex flex-wrap justify-center gap-x-2.5 items-center">
                <Timer className="fill-on-surface h-8 w-8" />
                <div className="w-4/5 flex content-center justify-center gap-x-5">
                </div>
            </div>
            <div className="w-full flex flex-wrap justify-center gap-x-2.5 items-center">
                <SwipeVertical className="fill-on-surface h-8 w-8" />
                <div className="w-4/5 flex content-center justify-center gap-x-5">
                    <SwitchButton state={swing1} stateChangeFunction={onSwing1StateChange} />
                </div>
            </div>
            <div className="w-full flex flex-wrap justify-center gap-x-2.5 items-center">
                <Swipe className="fill-on-surface h-8 w-8" />
                <div className="w-4/5 flex content-center justify-center gap-x-5">
                    <SwitchButton state={swing2} stateChangeFunction={onSwing2StateChange} />
                </div>
            </div>
            <div className="w-full flex flex-wrap justify-center gap-x-2.5 items-center">
                <EmojiEmotions className="fill-on-surface h-8 w-8" />
                <div className="w-4/5 flex content-center justify-center gap-x-5">
                    <SwitchButton state={isFeeling} stateChangeFunction={onIsFeelingStateChange} />
                </div>
            </div>

            <div className="w-full flex flex-wrap justify-center gap-x-2.5 items-center">
                <AirlineSeatFlatAngled className="fill-on-surface h-8 w-8" />
                <div className="w-4/5 flex content-center justify-center gap-x-5">
                    <SwitchButton state={isSleep} stateChangeFunction={onIsSleepStateChange} />
                </div>
            </div>
            <div className="w-full flex flex-wrap justify-center gap-x-2.5 items-center pb-5">
                <Favorite className="fill-on-surface h-8 w-8" />
                <div className="w-4/5 flex content-center justify-center gap-x-5">
                    <SwitchButton state={isHealth} stateChangeFunction={onIsHealthStateChange} />
                </div>
            </div>


        </>
    )
}