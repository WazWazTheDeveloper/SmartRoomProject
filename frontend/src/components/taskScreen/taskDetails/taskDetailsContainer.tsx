import styles from './TaskDetailsContainer.module.css'
import TaskDetails from './taskDetails'

function TaskDetailsContainer(props: any) {
    return (
        <div className={styles.container}>
            <TaskDetails />
        </div>
    )
}

export default TaskDetailsContainer