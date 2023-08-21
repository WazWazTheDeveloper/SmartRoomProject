import React, { useState } from 'react';

import styles from './TaskListItem.module.css'
import { Settings, DeleteForever } from '@mui/icons-material';

function TaskListItem(props: any) {

    return (
        <div className={styles.task_item_container}>
            <div className={styles.task_item_title_warper}>
            <p className={styles.task_item_title}>some very long ass title that is acutally realistiv and not gay</p>
            </div>
            <div className={styles.task_item_options}>
                <p className={styles.task_item_is_repeating}>repeating</p>
                <Switch />
                <Settings className={styles.icons} />
                <DeleteForever className={styles.icons} />
            </div>
        </div>
    )
}

{/* <label class="switch">
    <input checked="" type="checkbox">
    <div class="slider">
        <div class="circle">
            <svg class="cross" xml:space="preserve" style="enable-background:new 0 0 512 512" viewBox="0 0 365.696 365.696" y="0" x="0" height="6" width="6" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <g>
                    <path data-original="#000000" fill="currentColor" d="M243.188 182.86 356.32 69.726c12.5-12.5 12.5-32.766 0-45.247L341.238 9.398c-12.504-12.503-32.77-12.503-45.25 0L182.86 122.528 69.727 9.374c-12.5-12.5-32.766-12.5-45.247 0L9.375 24.457c-12.5 12.504-12.5 32.77 0 45.25l113.152 113.152L9.398 295.99c-12.503 12.503-12.503 32.769 0 45.25L24.48 356.32c12.5 12.5 32.766 12.5 45.247 0l113.132-113.132L295.99 356.32c12.503 12.5 32.769 12.5 45.25 0l15.081-15.082c12.5-12.504 12.5-32.77 0-45.25zm0 0"></path>
                </g>
            </svg>
            <svg class="checkmark" xml:space="preserve" style="enable-background:new 0 0 512 512" viewBox="0 0 24 24" y="0" x="0" height="10" width="10" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <g>
                    <path class="" data-original="#000000" fill="currentColor" d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z"></path>
                </g>
            </svg>
        </div>
    </div>
</label> */}

function Switch(props: any) {
    // TODO get state from parent element and function
    const [isClicked, setIsClicked] = useState(false);

    return (
        <label className={styles.switch}>
            <input checked={isClicked} type="checkbox" onClick={() => { setIsClicked(!isClicked) }} />
            <div className={styles.slider}>
                <div className={styles.circle}>
                    <svg className={styles.cross} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 365.696 365.696" y="0" x="0" height="6" width="6" version="1.1">
                        <g>
                            <path data-original="#000000" fill="currentColor" d="M243.188 182.86 356.32 69.726c12.5-12.5 12.5-32.766 0-45.247L341.238 9.398c-12.504-12.503-32.77-12.503-45.25 0L182.86 122.528 69.727 9.374c-12.5-12.5-32.766-12.5-45.247 0L9.375 24.457c-12.5 12.504-12.5 32.77 0 45.25l113.152 113.152L9.398 295.99c-12.503 12.503-12.503 32.769 0 45.25L24.48 356.32c12.5 12.5 32.766 12.5 45.247 0l113.132-113.132L295.99 356.32c12.503 12.5 32.769 12.5 45.25 0l15.081-15.082c12.5-12.504 12.5-32.77 0-45.25zm0 0"></path>
                        </g>
                    </svg>
                    <svg className={styles.checkmark} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" y="0" x="0" height="10" width="10" version="1.1">
                        <g>
                            <path data-original="#000000" fill="currentColor" d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z"></path>
                        </g>
                    </svg>
                </div>
            </div>
        </label>
    )
}
export default TaskListItem