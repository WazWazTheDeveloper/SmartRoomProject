import { useDevice } from "@/hooks/useDevice"
import { Delete, Edit } from "@mui/icons-material"

interface TodoTaskProps {
    deviceId: string
    dataAt: number
    varName: string
    newVarValue: any
    onDeleteFunction:() => void
    onEditFunction:() => void
}

export default function ViewTodoListItem(props: TodoTaskProps) {
    const [device, setDeviceId] = useDevice(props.deviceId);

    return (
        <div className="w-full flex justify-between ml-5">
            <div className="flex justify-start gap-x-2.5 items-center text-on-surface">
            <p>change</p>
                <p>&apos;&apos;{props.varName}&apos;&apos;</p>
                <p>at</p>
                <p>&apos;&apos;{device?.deviceName}&apos;&apos;[{props.dataAt}]</p>
                <p>to</p>
                <p>{props.newVarValue}</p>
            </div>
            <div className="flex gap-x-2.5 items-center">
                <Edit className="fill-on-surface h-6 w-6 cursor-pointer" onClick={props.onEditFunction}/>
                <Delete className="fill-on-surface h-6 w-6 cursor-pointer" onClick={props.onDeleteFunction}/>
            </div>
        </div>
    )
}