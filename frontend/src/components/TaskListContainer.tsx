import React from 'react';
import TaskListItem from './TaskListItem';
import styles from './TaskListContainer.module.css'
import {Add} from '@mui/icons-material';

function TaskListContainer(props: any) {
    return (
        <div className={styles.task_container}>
            <div className={styles.container_item}>
                <div className={styles.task_bar_container}>
                    <div className={styles.icon_warper}>
                        <Add className={styles.icon}/>
                    </div>
                </div>
            </div>

            <div className={styles.container_item}>
                <div className={styles.task_list}>
                    <TaskListItem />
                    <TaskListItem />
                    <TaskListItem />
                    <TaskListItem />
                    <TaskListItem />
                    <TaskListItem />
                    <TaskListItem />
                    <TaskListItem />
                    <TaskListItem />
                </div>
            </div>
        </div>
    )
}
export default TaskListContainer