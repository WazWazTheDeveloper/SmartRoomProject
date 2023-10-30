import styles from './DeviceAcDataDetail.module.css'
import { AcUnit, Air, AirlineSeatFlatAngled, DeviceThermostat, Dry, EmojiEmotions, FastForward, Favorite, HdrAuto, LocalFireDepartment, ModeFanOff, PowerSettingsNew, Swipe, SwipeVertical, Timer } from '@mui/icons-material';
import SwitchButton from '../../../switchButton';
import { Button, Slider } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../../../hooks/useAuth';
import { useApi } from '../../../../hooks/useApi';
import { ApiService } from '../../../../services/apiService';
import useDidMount from '../../../../hooks/useDidMount';

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
function DeviceAcDataDetail(props: props) {
    const deviceData = props.data
    const [userdata] = useAuth();
    const [data, isLoading, isError, error, fetchWithReauth] = useApi();
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
    },[props])
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
    function onButtonStateChange(e: React.ChangeEvent<HTMLElement>) {
        setIsOn(!isOn)
        toUpdate.current = true;
    }
    function onSwing1StateChange(e: React.ChangeEvent<HTMLElement>) {
        setSwing1(!swing1)
        toUpdate.current = true;
    }
    function onSwing2StateChange(e: React.ChangeEvent<HTMLElement>) {
        setSwing2(!swing2)
        toUpdate.current = true;
    }
    function onIsStrongStateChange(e: React.MouseEvent<HTMLElement>) {
        setIsStrong(!isStrong)
        toUpdate.current = true;
    }
    function onIsFeelingStateChange(e: React.ChangeEvent<HTMLElement>) {
        setIsFeeling(!isFeeling)
        toUpdate.current = true;
    }
    function onIsSleepStateChange(e: React.ChangeEvent<HTMLElement>) {
        setIsSleep(!isSleep)
        toUpdate.current = true;
    }
    function onIsHealthStateChange(e: React.ChangeEvent<HTMLElement>) {
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
            <div className={styles.device_attribute}>
                <PowerSettingsNew className={styles.device_attribute_icon} />
                <div className={styles.state_container}>
                    <SwitchButton state={isOn} stateChangeFunction={onButtonStateChange} />
                </div>
            </div>
            <div className={styles.device_attribute}>
                <DeviceThermostat className={styles.device_attribute_icon} />
                <div className={styles.state_container}>
                    <Slider className={styles.device_attribute_slider}
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
                            color: 'var(--primary-varient)',
                            '& .MuiSlider-markLabel': {
                                color: "var(--on-surface)",
                            },
                        }}
                    />
                </div>
            </div>
            <div className={styles.device_attribute}>
                <FastForward className={styles.device_attribute_icon} />
                <div className={styles.state_container}>
                    <Button variant={mode === 1 ? "contained" : "outlined"} className={styles.device_attribute_button} onClick={() => { onModeStateChange(1) }}>
                        <AcUnit />
                    </Button>
                    <Button variant={mode === 3 ? "contained" : "outlined"} className={styles.device_attribute_button} onClick={() => { onModeStateChange(3) }}>
                        <LocalFireDepartment />
                    </Button>
                    <Button variant={mode === 4 ? "contained" : "outlined"} className={styles.device_attribute_button} onClick={() => { onModeStateChange(4) }}>
                        <Air />
                    </Button>
                    <Button variant={mode === 2 ? "contained" : "outlined"} className={styles.device_attribute_button} onClick={() => { onModeStateChange(2) }}>
                        <Dry />
                    </Button>
                    <Button variant={mode === 0 ? "contained" : "outlined"} className={styles.device_attribute_button} onClick={() => { onModeStateChange(0) }}>
                        <HdrAuto />
                    </Button>
                </div>
            </div>

            <div className={styles.device_attribute}>
                <FastForward className={styles.device_attribute_icon} />
                <div className={styles.state_container}>
                    <Button variant={speed === 0 ? "contained" : "outlined"} className={styles.device_attribute_button} onClick={() => { onSpeedStateChange(0) }}>
                        I
                    </Button>
                    <Button variant={speed === 1 ? "contained" : "outlined"} className={styles.device_attribute_button} onClick={() => { onSpeedStateChange(1) }}>
                        II
                    </Button>
                    <Button variant={speed === 2 ? "contained" : "outlined"} className={styles.device_attribute_button} onClick={() => { onSpeedStateChange(2) }}>
                        III
                    </Button>

                    <Button variant={isStrong ? "contained" : "outlined"} className={styles.device_attribute_button} onClick={onIsStrongStateChange}>
                        Strong
                    </Button>
                    <Button variant={speed === 3 ? "contained" : "outlined"} className={styles.device_attribute_button} onClick={() => { onSpeedStateChange(3) }}>
                        AUTO
                    </Button>
                </div>
            </div>



            <div className={styles.device_attribute}>
                <Timer className={styles.device_attribute_icon} />
                <div className={styles.state_container}>

                </div>
            </div>

            <div className={styles.device_attribute}>
                <SwipeVertical className={styles.device_attribute_icon} />
                <div className={styles.state_container}>
                    <SwitchButton state={swing1} stateChangeFunction={onSwing1StateChange} />

                </div>
            </div>

            <div className={styles.device_attribute}>
                <Swipe className={styles.device_attribute_icon} />
                <div className={styles.state_container}>
                    <SwitchButton state={swing2} stateChangeFunction={onSwing2StateChange} />
                </div>
            </div>

            <div className={styles.device_attribute}>
                <EmojiEmotions className={styles.device_attribute_icon} />
                <div className={styles.state_container}>
                    <SwitchButton state={isFeeling} stateChangeFunction={onIsFeelingStateChange} />
                </div>
            </div>

            <div className={styles.device_attribute}>
                <AirlineSeatFlatAngled className={styles.device_attribute_icon} />
                <div className={styles.state_container}>
                    <SwitchButton state={isSleep} stateChangeFunction={onIsSleepStateChange} />
                </div>
            </div>

            <div className={styles.device_attribute}>
                <Favorite className={styles.device_attribute_icon} />
                <div className={styles.state_container}>
                    <SwitchButton state={isHealth} stateChangeFunction={onIsHealthStateChange} />
                </div>
            </div>
        </>


    )
}

export default DeviceAcDataDetail