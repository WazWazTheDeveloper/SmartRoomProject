import styles from './deviceDetailContainer.module.css'
import DeviceDetails from './deviceDetail';

function DeviceDetailsContainer(props: any) {
    return (
        <div className={styles.container}>
            <DeviceDetails />
        </div>
    )
}

export default DeviceDetailsContainer