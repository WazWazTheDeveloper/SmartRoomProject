import useAuth from '@/hooks/useAuth';
import { Switch } from '@mui/material'
import { useEffect, useState } from 'react'
import * as Icons from '@mui/icons-material'
import { useMutation } from 'react-query';
import axios from 'axios';
import useDidMount from '@/hooks/useDidMount';
interface Props {
    deviceID: string
    iconName?: string
    title?: string
    state: boolean
    dataID: number
    stateChangeFunction: (checked: boolean) => void
}
export default function SwitchData(props: Props) {
    const auth = useAuth();
    const [isOn, setIsOn] = useState(false);
    const updateDeviceMutation = useMutation({
        // mutationKey:[isOn],
        mutationFn: async (isOn: boolean) => {
            const res = await axios.put(`/api/v1/device/${props.deviceID}`, {
                updateList: [
                    {
                        propertyName: "data",
                        dataPropertyName: "isOn",
                        newValue: isOn,
                        dataID: props.dataID,
                        typeID: 0,
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

    useDidMount(() => {
    }, [isOn])

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsOn(event.target.checked);
        updateDeviceMutation.mutate(event.target.checked)
    };

    useEffect(() => {
        setIsOn(props.state);
    }, [props])

    if (props.title != "") {
        return (
            <div className='flex justify-start items-center pl-2 pr-2 w-full flex-wrap'>
                {props.title ? <h2 className='text-xl'>{props.title}</h2> : <></>}
                <Switch
                    checked={isOn}
                    onChange={handleChange}
                    inputProps={{ 'aria-label': 'controlled' }}
                />
            </div>
        )
    }
    else {
        // @ts-ignore
        const Icon = Icons[props.iconName]
        return (
            < div className='flex justify-start items-center pl-2 pr-2 w-full' >
                {props.iconName ? <Icon className='fill-neutral-1000 dark:fill-darkNeutral-1000 dark:border-darkNeutral-300' sx={{ fontSize: "2rem" }} /> : <></>}
                <Switch
                    checked={isOn}
                    onChange={handleChange}
                    inputProps={{ 'aria-label': 'controlled' }}
                />
            </div>
        )
    }
}