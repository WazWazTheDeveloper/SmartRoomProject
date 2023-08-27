import React, { useState } from 'react';

import styles from './TaskListItem.module.css'
import { Settings, DeleteForever } from '@mui/icons-material';
import SwitchButton from '../../switchButton';

function TaskListItem(props: any) {
    const [isClicked, setIsClicked] = useState(false);

    function onButtonStateChange(e: React.ChangeEvent<HTMLInputElement>) {
        setIsClicked(!isClicked)
    }

    return (
        <div className={styles.task_item_container}>
            <div className={styles.task_item_title_warper}>
            <p className={styles.task_item_title}>some very long ass title that is acutally realistiv and not gay</p>
            </div>
            <div className={styles.task_item_options}>
                <p className={styles.task_item_is_repeating}>repeating</p>
                <SwitchButton state={isClicked} stateChangeFunction={onButtonStateChange}/>
                <Settings className={styles.icons} />
                <DeleteForever className={styles.icons} />
            </div>
        </div>
    )
}

export default TaskListItem