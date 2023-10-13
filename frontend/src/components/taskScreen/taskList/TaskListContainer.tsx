import React from 'react';
import TaskListItem from './TaskListItem';
import styles from './TaskListContainer.module.css'
import { Add } from '@mui/icons-material';
import { useAppdata } from '../../../hooks/useAppdata';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import { useApi } from '../../../hooks/useApi';
import { ApiService } from '../../../services/apiService';
import { useAuth } from '../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

function TaskListContainer(props: any) {
    const [appdata, isAppdata] = useAppdata()
    const [userdata] = useAuth();
    const [data, isLoading, isError, error, fetchWithReauth] = useApi();

    let _taskList:ReactJSXElement[] = [];
    if (isAppdata) {
        _taskList = [];
        let taskList = appdata.getTaskList()
        for (let index = 0; index < taskList.length; index++) {
            const taskId = taskList[index].taskId;
            _taskList.push(<TaskListItem taskId={taskId}/>)
        }
    }

    function onAddClick (e:React.MouseEvent<HTMLElement>) {
        fetchWithReauth("/task/create-task", ApiService.REQUEST_POST,userdata.token);
    }

    return (
        <div className={styles.task_container}>
            <div className={styles.container_item}>
                <div className={styles.task_bar_container}>
                    <div className={styles.icon_warper} onClick={onAddClick}>
                        <Add className={styles.icon}/>
                    </div>
                </div>
            </div>

            <div className={styles.container_item}>
                <div className={styles.task_list}>
                    {_taskList}
                </div>
            </div>
        </div>
    )
}
export default TaskListContainer