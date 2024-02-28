import { DeviceDataTypesConfigs, TDeviceDataDeviceProperties, TDeviceDeviceDataProperties } from "./deviceData.interface"

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

export type TUpdateDataFromDeviceRequest = string

export type TUpdateDataToDeviceRequest = string

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

export type TAllMqttMessageType = TConnectionCheckResponse | TConnectionCheckRequest | TUpdateDataToDeviceResponse | TUpdateDataToDeviceRequest | TUpdateDataFromDeviceRequest | TGetDeviceRequest | TInitDeviceRespone | TInitDeviceRequest | TGetDeviceResponse | string