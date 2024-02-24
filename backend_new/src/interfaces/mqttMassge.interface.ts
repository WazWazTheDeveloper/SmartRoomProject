import { DeviceDataTypesConfigs, TDeviceDataDeviceProperties, TDeviceDeviceDataProperties, TDeviceDeviceDataPropertiesAny } from "./deviceData.interface"

export type TInitDeviceRequest = {
    operation: "initDevice"
    origin: string
    dataTypeArray: DeviceDataTypesConfigs[]
    deviceName?: string,
}

export type TInitDeviceRespone = {
    operation: "initDevice"
    origin: "server"
    target: string,
    isSuccessful: false
} | {
    operation: "initDevice"
    origin: "server"
    target: string,
    isSuccessful: true,
    _id: string
}

export type TGetDeviceRequest = {
    origin: string
    operation: "getDevice"
    deviceID: string
}

export type TGetDeviceResponse = {
    origin: "server"
    operation: "getDevice"
    deviceID: string
} & (({
    isSuccessful: true,
    data: TDeviceDataDeviceProperties[]
} & TDeviceDeviceDataProperties) | {
    isSuccessful: false
})

export type TUpdateDataFromDeviceRequest = {
    origin: string
    deviceID: string
    operation: "updateServer"
    dataID: number
    typeID: number
} & TDeviceDeviceDataPropertiesAny

export type TUpdateDataToDeviceRequest = {
    origin: "server"
    operation: "updateDevice"
    typeID: number
} & TDeviceDeviceDataPropertiesAny

export type TUpdateDataToDeviceResponse = {
    origin: string
    operation: "updateDevice"
    isSuccessful: boolean
}

export type TConnectionCheckRequest = {
    origin: "server"
    operation: "checkConnection"
}

export type TConnectionCheckResponse = {
    origin: string
    operation: "checkConnection"
    deviceID: string
}

export type TAllMqttMessageType = TConnectionCheckResponse | TConnectionCheckRequest | TUpdateDataToDeviceResponse | TUpdateDataToDeviceRequest | TUpdateDataFromDeviceRequest | TGetDeviceRequest | TInitDeviceRespone | TInitDeviceRequest | TGetDeviceResponse