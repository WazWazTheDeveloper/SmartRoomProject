import MultiStateButton from "../models/dataTypes/multiStateButtonData";
import NumberData from "../models/dataTypes/numberData";
import SwitchData from "../models/dataTypes/switchData";
import {
    DeviceDataTypes,
    DeviceDataTypesConfigs,
    TDeviceDataProperties,
} from "./deviceData.interface";

export type TDeviceProperty =
    | {
        propertyName: "deviceName";
        newValue: string;
    }
    | {
        propertyName: "mqttTopicID";
        newValue: string;
    }
    | {
        propertyName: "previousTopicID";
        newValue: string;
    }
    | {
        propertyName: "isAccepted";
        newValue: -1 | 0 | 1;
    }
    | {
        propertyName: "isAdminOnly";
        newValue: boolean;
    }
    | ({
        propertyName: "data";
    } & TDeviceDataProperties)
    | {
        propertyName: "isConnected";
        newValue: boolean;
    }
    | {
        propertyName: "isConnectedCheck";
        newValue: boolean;
    };

export type TDevice = {
    _id: string;
    deviceTargetID: string;
    deviceName: string;
    mqttTopicID: string;
    previousTopicID: string;
    isAccepted: -1 | 0 | 1;
    isAdminOnly: boolean;
    data: TDeviceDataObject[];
    isConnected: boolean;
    isConnectedCheck: boolean;
};

export type TDeviceJSON_DB = {
    _id: string;
    deviceTargetID: string;
    deviceName: string;
    mqttTopicID: string;
    previousTopicID: string;
    isAccepted: -1 | 0 | 1;
    isAdminOnly: boolean;
    data: DeviceDataTypes[];
    isConnected: boolean;
    isConnectedCheck: boolean;
};

export type TDataConfig = {
    typeID: number;
    dataConfig: DeviceDataTypesConfigs;
};

export type TDeviceDataObject = SwitchData | NumberData | MultiStateButton;
