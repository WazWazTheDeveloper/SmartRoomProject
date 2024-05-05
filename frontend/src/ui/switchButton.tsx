import useAuth from '@/hooks/useAuth';
import { Switch } from '@mui/material'
import { useEffect, useState } from 'react'

interface Props {
  state: boolean
  stateChangeFunction: (checked: boolean) => void
}
export default function SwitchButton(props: Props) {
  const auth = useAuth();
  const [isOn, setIsOn] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsOn(event.target.checked);
  };

  useEffect(() => {
    setIsOn(props.state);
  }, [props])

  return (
    <Switch
      checked={isOn}
      onChange={handleChange}
      inputProps={{ 'aria-label': 'controlled' }}
    />
  )
}