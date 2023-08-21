import styles from './DeviceAcData.module.css'

// TODO: add type to props
function AcData(props: any) {
    // console.log(props.data)
    return (
        <div className={styles.data_container + " " + styles.acdata_container}>
            <p className={styles.acdata_ison}>{props.data.isOn ? "ON" : "OFF"}</p>
            <div className={styles.acdata_sub_container}>
                <div className={styles.acdata_p_container}>
                    <p>{"Mode: "}</p>
                    <p>{props.data.mode}</p>
                </div>
                <div className={styles.acdata_p_container}>
                    <p>{"Swing 1: "}</p>
                    <p className={props.data.isOn ? styles.green : styles.red}>{props.data.swing1 ? "ON" : "OFF"}</p>
                </div>
                <div className={styles.acdata_p_container}>
                    <p>{"Timer: "}</p>
                    {/* add the color for time as well */}
                    <p className={props.data.timer > 0 ? styles.green : styles.red}>{props.data.timer}</p>
                </div>
                <div className={styles.acdata_p_container}>
                    <p>{"Health: "}</p>
                    <p className={props.data.isHealth ? styles.green : styles.red}>{props.data.isHealth ? "ON" : "OFF"}</p>
                </div>
                <div className={styles.acdata_p_container}>
                    {/* this is just empty line */}
                    <p>‏‏‎ ‎</p>
                    <p>‏‏‎ ‎</p>
                </div>
            </div>
            <div className={styles.acdata_sub_container}>
                <div className={styles.acdata_p_container}>
                    <p>{"Speed: "}</p>
                    <p>{props.data.speed}</p>
                </div>
                <div className={styles.acdata_p_container}>
                    <p>{"Swing 2: "}</p>
                    <p className={props.data.swing2 ? styles.green : styles.red}>{props.data.swing2 ? "ON" : "OFF"}</p>
                </div>
                <div className={styles.acdata_p_container}>
                    <p>{"Sleep:"}</p>
                    <p className={props.data.isSleep ? styles.green : styles.red}>{props.data.isSleep ? "ON" : "OFF"}</p>
                </div>
                <div className={styles.acdata_p_container}>
                    {/* this is just empty line */}
                    <p>‏‏‎ ‎</p>
                    <p>‏‏‎ ‎</p>
                </div>
                <div className={styles.acdata_p_container}>
                    {/* this is just empty line */}
                    <p>‏‏‎ ‎</p>
                    <p>‏‏‎ ‎</p>
                </div>
            </div>
        </div>
    )
}

export default AcData