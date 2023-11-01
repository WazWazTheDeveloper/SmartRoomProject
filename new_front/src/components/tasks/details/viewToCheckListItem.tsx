import { Delete, Edit } from "@mui/icons-material"

const CHECK_EQUAL_TO: number = 0
const CHECK_GREATER_THAN: number = 1
const CHECK_LESS_THAN: number = 2

interface VarCheckProps {
    deviceId: string
    dataIndex: number
    varName: string
    checkType: number
    valueToCompareTo: any
    onDeleteFunction: () => void
    onEditFunction: () => void
}

export default function ViewToCheckListItem(props: VarCheckProps) {
    let checkType: string = "";
    switch (props.checkType) {
        case (CHECK_EQUAL_TO): {
            checkType = "equal to";
            break;
        }
        case (CHECK_GREATER_THAN): {
            checkType = "greater than";
            break;
        }
        case (CHECK_LESS_THAN): {
            checkType = "less than";
            break;
        }
    }
    return (
        // TODO: make this pretty
        <div className="w-full flex justify-between ml-5">
            <div className="flex justify-start gap-x-2.5 items-center text-on-surface">
                <p>Device</p>
                <p>&apos;&apos;{props.deviceId}&apos;&apos;</p>
                <p>at</p>
                <p>[{props.dataIndex}]</p>
                <p>if</p>
                <p>&apos;&apos;{props.varName}&apos;&apos;</p>
                <p>{checkType}</p>
                <p>&apos;&apos;{props.valueToCompareTo}&apos;&apos;</p>
            </div>
            <div className="flex gap-x-2.5 items-center">
                <Edit className="fill-on-surface h-6 w-6 cursor-pointer" onClick={props.onEditFunction}/>
                <Delete className="fill-on-surface h-6 w-6 cursor-pointer" onClick={props.onDeleteFunction}/>
            </div>
        </div>
    )
}