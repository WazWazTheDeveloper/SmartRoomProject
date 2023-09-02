import React, { useState, useEffect } from 'react';
import styles from './deviceDetail.module.css'
import DeviceAcDataDetail from './dataTypes/DeviceAcDataDetail';
import { useParams } from 'react-router-dom';
import { useAppdata } from '../../../hooks/useAppdata';


function DeviceDetails(props: any) {
    const [appdata, isAppdata] = useAppdata()
    const params = useParams();

    let details = <></>
    let deviceName = ""

    if (isAppdata) {
        let device = appdata.getDeviceByUUID(String(params.id))
        if (device) {
            details = <DeviceAcDataDetail
                targetDevice={String(params.id)}
                dataAt={Number(params.dataat)}
                data={device.deviceData[Number(params.dataat)].data}
            />

            deviceName = device.deviceName;
        }
    }



    return (
        <div className={styles.container}>
            <h1 className={styles.device_name}>{deviceName}</h1>
            <div className={styles.device_attributes}>
                {details}
            </div>
        </div>

    )
}

export default DeviceDetails