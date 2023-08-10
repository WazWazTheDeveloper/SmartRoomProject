interface DeviceType {
    deviceName:string
    uuid: string
    isAccepted:boolean
    topicPath:string
    isConnected: boolean
    isConnectedCheck: boolean
    // deviceType: Array<number>
    // deviceData: Array<any>
    deviceData: Array<DeviceDataType>
}

interface DeviceDataType {
    dataType: number
    data:any
}

export {DeviceType,DeviceDataType}
