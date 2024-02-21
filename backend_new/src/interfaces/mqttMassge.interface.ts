import { DeviceDataTypesConfigs, TDeviceDeviceDataPropertiesAny } from "./deviceData.interface"

type TInitDeviceMassage = {
    origin : string
    dataTypeArray: DeviceDataTypesConfigs[]
    deviceName?: string,
}

type TInitDeviceRespone = {
    target : string,
    isSuccessful : false
} | {
    target : string,
    isSuccessful : true,
    _id : string
}


type TUpdateDataMassage = {
    typeID : number
} & TDeviceDeviceDataPropertiesAny

// add respond expected type