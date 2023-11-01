import { Switch } from '@headlessui/react'
import { useState } from 'react'

interface Props {
    state :boolean
    stateChangeFunction : (checked:boolean) => void
}
export default function SwitchButton(props:Props) {
    return (
      <Switch
        checked={props.state}
        onChange={props.stateChangeFunction}
        className={`${
            props.state ? 'bg-green-500' : 'bg-red-500'
        } relative inline-flex h-6 w-11 items-center rounded-full`}
      >
        <span className="sr-only">Enable notifications</span>
        <span
          className={`${
            props.state ? 'translate-x-6' : 'translate-x-1'
          } inline-block h-4 w-4 transform rounded-full bg-white transition`}
        />
      </Switch>
    )
}