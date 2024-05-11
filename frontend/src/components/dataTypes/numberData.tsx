import useAuth from '@/hooks/useAuth'
import * as Icons from '@mui/icons-material'
import { Slider } from '@mui/material'
import axios from 'axios'
import { useState } from 'react'
import { useMutation } from 'react-query'


interface Props {
    deviceID: string
    iconName?: string
    title?: string
    currentValue: number
    dataID: number
    minValue: number
    maxValue: number
    jumpValue: number
    symbol: string
}

export default function NumberData(props: Props) {
    const auth = useAuth();
    const [value, setValue] = useState(props.currentValue)
    const updateDeviceMutation = useMutation({
        mutationFn: async () => {
            const res = await axios.put(`/api/v1/device/${props.deviceID}`, {
                updateList: [
                    {
                        propertyName: "data",
                        dataPropertyName: "currentValue",
                        newValue: value,
                        dataID: props.dataID,
                        typeID: 1,
                    }
                ]
            }, {
                headers: {
                    Authorization: `Bearer ${auth.authToken}`
                }
            })
            if (res.status == 401) {
                auth.refreshToken()
            }

            return res.data
        }
    })
    function valuetext(value: number) {
        return `${value}${props.symbol}`;
    }

    const handleChange = (event: Event, newValue: number | number[]) => {
        setValue(newValue as number)
    };

    const handleCommit = (event: React.SyntheticEvent | Event, value: number | number[]) => {
        updateDeviceMutation.mutate()
    };



    if (props.title != "") {
        return (
            <div className="w-[98%] pl-2 pr-2 flex justify-start items-center flex-wrap box-border sm:w-full sm:max-w-[52rem] sm:justify-start">
                {props.title ? <h2 className='text-xl sm:pl-2'>{props.title}</h2> : <></>}
                <div className='w-full flex justify-center items-center pl-2 pr-2'>
                    <Slider
                        min={props.minValue}
                        max={props.maxValue}
                        step={props.jumpValue}
                        valueLabelDisplay="auto"
                        getAriaValueText={valuetext}
                        valueLabelFormat={valuetext}
                        onChange={handleChange}
                        onChangeCommitted={handleCommit}
                        value={value} />
                </div>
            </div>
        )
    }
    else {
        // @ts-ignore
        const Icon = Icons[props.iconName]
        return (
            <div className="w-[98%] pl-2 pr-2 flex justify-start items-center box-border sm:w-full sm:max-w-[52rem]">
                {props.iconName ? <Icon className='fill-neutral-1000 dark:fill-darkNeutral-1000 dark:border-darkNeutral-300 sm:pl-2' sx={{ fontSize: "2rem" }} /> : <></>}
                <div className='w-full flex justify-center items-center pl-2 pr-2'>
                    <Slider
                        min={props.minValue}
                        max={props.maxValue}
                        step={props.jumpValue}
                        valueLabelDisplay="auto"
                        getAriaValueText={valuetext}
                        valueLabelFormat={valuetext}
                        onChange={handleChange}
                        onChangeCommitted={handleCommit}
                        value={value} />
                </div>
            </div>
        )
    }
}