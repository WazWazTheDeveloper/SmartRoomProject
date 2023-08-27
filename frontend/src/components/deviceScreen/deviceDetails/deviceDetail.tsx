import React, { useState, useEffect } from 'react';
import styles from './deviceDetail.module.css'
import DeviceAcDataDetail from './dataTypes/DeviceAcDataDetail';
import { useParams } from 'react-router-dom';
import { useAppdata } from '../../../hooks/useAppdata';


function DeviceDetails(props: any) {
    const appdata = useAppdata()
    const params = useParams();
    let details = <></>
    let deviceName = "a"

    // TODO: swap this to use appdata service
    function findDeviceByUUID(deviceId: string) {
        if (!appdata) {
            return 
        }
        // TODO: take a look at this
        if (!appdata.deviceList) {
            return 
        }
        for (let index = 0; index < appdata.deviceList.length; index++) {
            const device = appdata.deviceList[index];
            if (device.uuid == deviceId) {
                return device
            }
        }
        throw new Error("device not found")
    }
    
    if(appdata) {
        if(appdata.deviceList) {
            let device = findDeviceByUUID(String(params.id))
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