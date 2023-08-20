import React from 'react';
import styles from './DeviceSumContainer.module.css'
import { ReactComponent as SettingsSVG } from '../svg/settings_FILL0_wght400_GRAD0_opsz48.svg'

// TODO: add type to props
// TODO: make mobile version of this as well
function DeviceSumContainer(props: any) {
  let isConnectedDotClass = props.isConnected ? styles.green_dot : styles.gray_dot
  return (
    <div className={styles.device_container}>
      <div className={styles.device_sub_container}>
        <div className={styles.device_device_name_container}>
          <p>{props.deviceName}</p>
          <SettingsSVG className={styles.setting_icon} />
        </div>
        <div className={styles.device_is_online_container}>
          <div className={styles.device_is_online_dot + " " + isConnectedDotClass}></div>
          <p>{props.isConnected ? "Online" : "Offline"}</p>
        </div>
      </div>
      <div className={styles.device_sub_container}>
        <AcData data={props.data.data} />
      </div>
    </div>
  )
}

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

export default DeviceSumContainer