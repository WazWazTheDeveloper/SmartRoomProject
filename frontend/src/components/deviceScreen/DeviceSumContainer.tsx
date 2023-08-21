import React from 'react';
import styles from './DeviceSumContainer.module.css'
import {Settings } from '@mui/icons-material';
import AcData from './dataTypes/DeviceAcData';
import { StringMappingType } from 'typescript';

// TODO: finalize this
interface Data {
  isConnected: boolean
  deviceName: string
  data:{
    dataType:number
    data:{}
  }
}

function DeviceSumContainer(props: Data) {
  let isConnectedDotClass = props.isConnected ? styles.green_dot : styles.gray_dot
  return (
    <div className={styles.device_container}>
      <div className={styles.device_sub_container}>
        <div className={styles.device_device_name_container}>
          <p>{props.deviceName}</p>
          <Settings className={styles.setting_icon} />
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

export default DeviceSumContainer