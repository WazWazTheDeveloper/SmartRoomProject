import React, { useState,useEffect } from 'react';

import styles from './TaskListItem.module.css'
import { Settings, DeleteForever } from '@mui/icons-material';
import SwitchButton from '../../switchButton';
import { useAppdata } from '../../../hooks/useAppdata';
import useDidMount from '../../../hooks/useDidMount';
import { useApi } from '../../../hooks/useApi';
import { ApiService } from '../../../services/apiService';
import { useAuth } from '../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
interface Props {
    taskId:string
}

function TaskListItem(props: Props) {
    const [userdata] = useAuth();
    const [data, isLoading, isError, error, fetchWithReauth] = useApi();
    // const [updateData, updateIsLoading, updateIsError, updateError, updateFetchWithReauth] = useApi("/task/update-task", ApiService.REQUEST_POST);
    // const [deleteData, deleteIsLoading, deleteIsError, deleteError, deleteFetchWithReauth] = useApi("/task/delete-task", ApiService.REQUEST_POST);
    const [appdata, isAppdata] = useAppdata()
    const [isOn, setIsOn] = useState(false);
    const [taskName, setTaskName] = useState("");
    const [isRepeating, setIsRepeating] = useState(true);
    const navigate = useNavigate();
    const [triggerUpdate, setTriggerUpdate] = useState(false);

    function onButtonStateChange(e: React.ChangeEvent<HTMLInputElement>) {
        setIsOn(!isOn)
        setTriggerUpdate(!triggerUpdate);
    }

    function onSettingsClick() {
        navigate(`/scheduled_tasks/${props.taskId}`)
    }

    function onDeleteClick() {
        let body = {
            targetTask: props.taskId,
        }
        fetchWithReauth("/task/delete-task", ApiService.REQUEST_POST,userdata.token, body)
    }

    useEffect(()=> {
        if(isAppdata) {
            let task = appdata.getTaskByUUID(props.taskId)
            setTaskName(task.taskName)
            setIsOn(task.isOn);
            setIsRepeating(task.isRepeating);
        }
    },[appdata])

    useDidMount(() => {
        let body = {
            targetTask: props.taskId,
            data: {
                isOn: isOn
            }
        }
        fetchWithReauth("/task/update-task", ApiService.REQUEST_POST,userdata.token, body)
    },[triggerUpdate])


    return (
        <div className={styles.task_item_container}>
            <div className={styles.task_item_title_warper}>
            <p className={styles.task_item_title}>{taskName}</p>
            </div>
            <div className={styles.task_item_options}>
                <p className={styles.task_item_is_repeating}>{isRepeating ? "repeating" : "once"}</p>
                <SwitchButton state={isOn} stateChangeFunction={onButtonStateChange}/>
                <Settings className={styles.icons} onClick={() => {onSettingsClick()}}/>
                <DeleteForever className={styles.icons} onClick={() => {onDeleteClick()}}/>
            </div>
        </div>
    )
}

export default TaskListItem