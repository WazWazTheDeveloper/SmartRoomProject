import { useState } from 'react';
import { useApi } from '../../../../hooks/useApi';
import { useAuth } from '../../../../hooks/useAuth';
import { ApiService } from '../../../../services/apiService';
import styles from './timeCheckAdd.module.css'
import { Check, Delete } from '@mui/icons-material';

interface props {
    id:string | undefined
    onDeleteFunction : Function
}
function TimeChackAdd(props: props) {
    const [userdata] = useAuth();
    const [data, isLoading, isError, error, fetchWithReauth] = useApi();

    const [timingData, setTimingData] = useState<any>();

    function handleTimingDataInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        setTimingData(e.target.value)
    }

    function onSubmit() {
        let body = {
            targetTask: props.id,
            timingData: timingData
        }
        fetchWithReauth("/task/add-time-check", ApiService.REQUEST_POST,userdata.token, body)
        props.onDeleteFunction()
    }
    
    return (
        <div className={styles.timer_check_add}>
            <div className={styles.timer_check_attributes}>
                <p>timing string</p>
                <input className={styles.timer_check_add_input} type='text' onChange={handleTimingDataInputChange} value={timingData}/>
            </div>
            <div className={styles.timer_check_options}>
                <Check className={styles.attribute_icon} onClick={onSubmit} />
                <Delete className={styles.attribute_icon} onClick={() => {props.onDeleteFunction()}}/>
            </div>

        </div>
    )
}

export default TimeChackAdd