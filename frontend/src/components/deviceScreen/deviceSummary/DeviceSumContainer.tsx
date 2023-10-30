import React, { useContext } from 'react';
import styles from './DeviceSumContainer.module.css'
import { Settings } from '@mui/icons-material';
import AcData from './dataTypes/DeviceAcData';
import { StringMappingType } from 'typescript';
import { AuthContext, ContextType } from '../../providers/authProvider';
import { useAuth } from '../../../hooks/useAuth';
import { useApi } from '../../../hooks/useApi';
import { ApiService } from '../../../services/apiService';

interface Data {
  isConnected: boolean
  deviceName: string
  data: {
    dataType: number
    data: {}
  }
  onClick: Function
  uuid: string
}


function DeviceSumContainer(props: Data) {
  const [data, isLoading, isError, error, fetchWithReauth] = useApi();
  const [userdata] = useAuth();

  let isConnectedDotClass = props.isConnected ? styles.green_dot : styles.gray_dot

  function deleteDevice(e: React.MouseEvent<SVGSVGElement>) {
    e.stopPropagation();
    let delete_path = '/device/delete_device?uuid=' + props.uuid;
    fetchWithReauth(delete_path,ApiService.REQUEST_POST,userdata.token)
  }

  return (
    <div className={styles.device_container} onClick={() => { props.onClick() }}>
      <div className={styles.device_sub_container}>
        <div className={styles.device_device_name_container}>
          <p>{props.deviceName}</p>
          <Settings className={styles.setting_icon} onClick={deleteDevice} />
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