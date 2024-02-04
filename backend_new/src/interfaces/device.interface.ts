import SwitchData from "../models/dataTypes/switchData"
import { DeviceDataTypes, DeviceDataTypesConfigs} from "./deviceData.interface"

export type TDevice = {
    _id: string
    mqttTopicID: string
    isAccepted: -1 | 0 | 1
    isAdminOnly: boolean
    data: (TDataObject)[]
}

export type TDeviceJSON_DB = {
    _id: string
    mqttTopicID: string
    isAccepted: -1 | 0 | 1
    isAdminOnly: boolean
    data: DeviceDataTypes[]
}

export type TDataConfig = {
    typeID:number
    dataConfig : DeviceDataTypesConfigs
}

export type TDataObject = SwitchData

