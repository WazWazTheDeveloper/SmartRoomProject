import SwitchData from "../models/dataTypes/switchData"
import { DeviceDataTypes, DeviceDataTypesConfigs } from "./deviceData.interface"

export type TDeviceProperty =
    {
        propertyName: "deviceName"
        newValue: string
    } |
    {
        propertyName: "mqttTopicID"
        newValue: string
    } |
    {
        propertyName: "isAccepted"
        newValue: -1 | 0 | 1
    } |
    {
        propertyName: "isAdminOnly"
        newValue: boolean
    }

export type TDevice = {
    _id: string
    deviceName: string
    mqttTopicID: string
    isAccepted: -1 | 0 | 1
    isAdminOnly: boolean
    data: (TDataObject)[]
}

export type TDeviceJSON_DB = {
    _id: string
    deviceName:string
    mqttTopicID: string
    isAccepted: -1 | 0 | 1
    isAdminOnly: boolean
    data: DeviceDataTypes[]
}

export type TDataConfig = {
    typeID: number
    dataConfig: DeviceDataTypesConfigs
}

export type TDataObject = SwitchData

