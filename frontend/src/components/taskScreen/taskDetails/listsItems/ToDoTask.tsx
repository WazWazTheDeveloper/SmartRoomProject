import styles from './todoTask.module.css'

import { Delete, Edit } from "@mui/icons-material"

interface ToDoTaskProps {
    deviceId: string
    dataAt: number
    varName: string
    newVarValue: any
    onDeleteFunction:() => void
    onEditFunction:() => void
}
function TodoTask(props: ToDoTaskProps) {
    return (
        <div className={styles.todo_check}>
            <div className={styles.todo_check_attributes}>
                <p>change</p>
                <p>"{props.varName}"</p>
                <p>at</p>
                <p>"{props.deviceId}"[{props.dataAt}]</p>
                <p>to</p>
                <p>{props.newVarValue}</p>
            </div>
            <div className={styles.todo_check_options}>
                <Edit className={styles.attribute_icon} onClick={props.onEditFunction}/>
                <Delete className={styles.attribute_icon} onClick={props.onDeleteFunction}/>
            </div>
        </div>
    )
}
export default TodoTask