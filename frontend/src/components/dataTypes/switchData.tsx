import useAuth from '@/hooks/useAuth';
import { Switch } from '@mui/material'
import { useEffect, useState } from 'react'

interface Props {
    iconName?: string
    title?: string
    state: boolean
    stateChangeFunction: (checked: boolean) => void
}
export default function SwitchData(props: Props) {
    const auth = useAuth();
    const [isOn, setIsOn] = useState(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsOn(event.target.checked);
    };

    useEffect(() => {
        setIsOn(props.state);
    }, [props])

    return (
        <div className='flex justify-start items-center pl-2 pr-2 w-full flex-wrap'>
            {props.title ? <h2>{props.title}</h2> : <></>}
            <Switch
                checked={isOn}
                onChange={handleChange}
                inputProps={{ 'aria-label': 'controlled' }}
            />
        </div>
    )
}