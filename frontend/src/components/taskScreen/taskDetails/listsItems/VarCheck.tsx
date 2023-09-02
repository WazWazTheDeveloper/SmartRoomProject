import styles from './varCheck.module.css'

import { Delete, Edit } from "@mui/icons-material"

let CHECK_EQUAL_TO: number = 0
let CHECK_GREATER_THAN: number = 1
let CHECK_LESS_THAN: number = 2

interface VarCheckProps {
    deviceId: string
    dataIndex: number
    varName: string
    checkType: number
    valueToCompareTo: any
    onDeleteFunction:() => void
    onEditFunction:() => void
}
function VarCheck(props: VarCheckProps) {
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
        <div className={styles.var_check}>
            <div className={styles.var_check_attributes}>
                <p>check</p>
                <p>"{props.deviceId}"</p>
                <p>at</p>
                <p>[{props.dataIndex}]</p>
                <p>if</p>
                <p>{props.varName}</p>
                <p>{checkType}</p>
                <p>{props.valueToCompareTo}</p>
            </div>
            <div className={styles.var_check_options}>
                <Edit className={styles.attribute_icon} onClick={props.onEditFunction}/>
                <Delete className={styles.attribute_icon} onClick={props.onDeleteFunction}/>
            </div>
        </div>
    )
}
export default VarCheck