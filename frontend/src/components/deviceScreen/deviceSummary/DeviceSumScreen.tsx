import React, { useState ,useEffect} from 'react';
import styles from './DeviceSumScreen.module.css'
import DeviceSumContainer from './DeviceSumContainer';
import { Route, Routes, useNavigate, useParams } from 'react-router-dom';
import DeviceDetailsContainer from '../deviceDetails/deviceDetailContainer';

// TODO: add type
interface props {

}
function DeviceListScreen(props: any) {
  const navigate = useNavigate();
  let _deviceList = [];

    if (Object.keys(props.appdata).length != 0) {
        let count = 0;
        _deviceList = [];
        //   @ts-ignore
        for (let index = 0; index < props.appdata.deviceList.length; index++) {
            // @ts-ignore
            const device = props.appdata.deviceList[index];
            //@ts-ignore
            for (let index2 = 0; index2 < device.deviceData.length; index2++) {
                //@ts-ignore
                const data = device.deviceData[index2];
                let element =
                    <div className={styles.device_sum_warper}>
                        <DeviceSumContainer deviceName={device.deviceName} isConnected={device.isConnected} data={data} onClick={() => {navigate(`/${device.uuid}/${index2}`)}}/>
                    </div>
                _deviceList.push(element)
                count++;
            }
        }

        let numOfTiles = 6;
        if (window.screen.width < 480) {
            numOfTiles = 2
        }
        for (let index = count % numOfTiles; index < numOfTiles; index++) {
            let element =
                <div className={styles.device_sum_warper}>
                </div>
            _deviceList.push(element)
        }
    }

    return (
        <>
                    <div className={styles.device_sum_container}>
                        {_deviceList}
                    </div>
        </>
    )
}

export default DeviceListScreen