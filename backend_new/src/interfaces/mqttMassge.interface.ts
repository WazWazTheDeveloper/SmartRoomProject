import { DeviceDataTypesConfigs, TDeviceDeviceDataPropertiesAny } from "./deviceData.interface"

type TInitDeviceRequest = {
    operation : "initDevice"
    origin : string
    dataTypeArray: DeviceDataTypesConfigs[]
    deviceName?: string,
}

type TInitDeviceRespone = {
    operation : "initDevice"
    target : string,
    isSuccessful : false
} | {
    operation : "initDevice"
    target : string,
    isSuccessful : true,
    _id : string
}

type TGetDeviceRequest = {
    operation : "getDevice"
    deviceID : string
}

type TUpdateDataFromDeviceRequest = {
    deviceID : string
    operation : "updateServer"
    dataID : number
    typeID : number
} & TDeviceDeviceDataPropertiesAny

type TUpdateDataFromDeviceResponse = {
    isSuccessful : boolean
}

type TUpdateDataToDeviceRequest = {
    operation : "updateDevice"
    typeID : number
} & TDeviceDeviceDataPropertiesAny

type TUpdateDataToDeviceResponse = {
    isSuccessful : boolean
}

type TConnectionCheckRequest = {
    operation : "checkConnection"
}

type TConnectionCheckResponse = {
    operation : "checkConnection"
    deviceID : string
}