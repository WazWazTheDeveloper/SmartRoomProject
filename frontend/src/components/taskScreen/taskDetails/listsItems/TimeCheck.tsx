import styles from './timeCheck.module.css'

import { Delete, Edit } from "@mui/icons-material"

interface TimeCheckProps {
    timingData: string
    onDeleteFunction:() => void
    onEditFunction:() => void
}

function TimeCheck(props: TimeCheckProps) {
    return (
        <div className={styles.time_check}>
            <div className={styles.time_check_attributes}>
                <p>{"timingData string: "}</p>
                <p>{props.timingData}</p>
            </div>
            <div className={styles.time_check_options}>
                <Edit className={styles.attribute_icon} onClick={props.onEditFunction}/>
                <Delete className={styles.attribute_icon} onClick={props.onDeleteFunction}/>
            </div>
        </div>
    )
}
export default TimeCheck