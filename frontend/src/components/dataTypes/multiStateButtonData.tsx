import useAuth from "@/hooks/useAuth"
import { useState } from "react"
import * as Icons from '@mui/icons-material'

interface Props {
    deviceID: string
    iconName?: string
    title?: string
    currentState: number
    dataID: number
    stateList: TStateItem[]
}

export type TStateItem = {
    stateValue: number
    isIcon: boolean
    icon: string
    stateTitle: string
}

export default function MultiStateButtonData(props: Props) {
    const auth = useAuth();
    const [state, setState] = useState(props.currentState);
    return (
        <div className='flex justify-start items-center pl-2 pr-2 w-full flex-wrap'>
            {/* <h2 className='text-xl w-full'>{"props.title"}</h2> */}
            {props.title ? <h2 className='text-xl w-full'>{props.title}</h2> : <></>}
            <div className="w-full flex flex-wrap gap-2 justify-evenly">
                {
                    props.stateList.map((item: TStateItem, index: number) => {
                        //@ts-ignore
                        const Icon = Icons[item.icon]

                        return (
                            <div key={index} 
                            className={"border-box w-24 h-14 p-2 flex justify-center items-center border border-solid border-neutral-1000 dark:border-darkNeutral-1000 rounded-lg "+ (item.stateValue==state ? "bg-neutral-500 dark:bg-darkNeutral-500" : "bg-neutral-200 dark:bg-darkNeutral-200") }
                            onClick={()=>{setState(item.stateValue)}}
                            >
                                {item.isIcon ?
                                    <Icon className='fill-neutral-1000 dark:fill-darkNeutral-1000 dark:border-darkNeutral-300 h-10 w-10' /> :
                                    <p>{item.stateTitle}</p>}
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}