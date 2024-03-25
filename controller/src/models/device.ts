import {
    TDeviceDataObject,
    TDevice,
    TDeviceJSON_DB,
} from "../interfaces/device.interface";
import SwitchData from "./dataTypes/switchData";
import {
    DeviceDataTypes,
    DeviceDataTypesConfigs,
    TNumberData,
    TSwitchData,
} from "../interfaces/deviceData.interface";
import { ERROR_LOG, logEvents } from "../middleware/logger";
import NumberData from "./dataTypes/numberData";
import MultiStateButton from "./dataTypes/multiStateButtonData";

export default class Device implements TDevice {
    //is accepted states
    static readonly DEVICE_ACCEPTED_YES = 1;
    static readonly DEVICE_ACCEPTED_NO = -1;
    static readonly DEVICE_ACCEPTED_UNDEFINED = 0;

    // types
    static readonly SWITCH_TYPE = 0;
    static readonly NUMBER_TYPE = 1;
    static readonly MULTI_STATE_BUTTON_TYPE = 2;

    _id: string;
    deviceTargetID: string;
    deviceName: string;
    mqttTopicID: string;
    isAccepted: -1 | 0 | 1;
    isAdminOnly: boolean;
    data: TDeviceDataObject[];
    isConnected: boolean;
    isConnectedCheck: boolean;
    previousTopicID: string;

    constructor(
        _id: string,
        deviceTargetID: string,
        deviceName: string,
        mqttTopicID: string,
        previousTopicID: string,
        isAccepted: -1 | 0 | 1,
        isAdminOnly: boolean,
        data: TDeviceDataObject[],
        isConnected: boolean,
        isConnectedCheck: boolean,
    ) {
        this._id = _id;
        this.deviceTargetID = deviceTargetID;
        this.mqttTopicID = mqttTopicID;
        this.isAccepted = isAccepted;
        this.isAdminOnly = isAdminOnly;
        this.data = data;
        this.deviceName = deviceName;
        this.isConnected = isConnected;
        this.isConnectedCheck = isConnectedCheck;
        this.previousTopicID = previousTopicID;
    }

    // create device from with DeviceDataTypesConfigs
    static createNewDevice(
        _id: string,
        deviceTargetID: string,
        deviceName: string,
        mqttTopicID: string,
        dataTypeArray: DeviceDataTypesConfigs[],
    ): Device {
        const isAccepted = Device.DEVICE_ACCEPTED_UNDEFINED;
        const isAdminOnly = false;
        const data: TDeviceDataObject[] = [];

        for (let dataID = 0; dataID < dataTypeArray.length; dataID++) {
            const dataConfig = dataTypeArray[dataID];
            const newData: TDeviceDataObject = Device.getNewData(dataConfig);
            data.push(newData);
        }

        const newDevice = new Device(
            _id,
            deviceTargetID,
            deviceName,
            mqttTopicID,
            "",
            isAccepted,
            isAdminOnly,
            data,
            false,
            false
        );

        return newDevice;
    }

    // create device from TDeviceJSON_DB JSON object
    static createDeviceFromTDeviceJSON_DB(deviceData: TDeviceJSON_DB): Device {
        const data: TDeviceDataObject[] = [];
        for (let dataID = 0; dataID < deviceData.data.length; dataID++) {
            const dataJSON = deviceData.data[dataID];
            const newData: TDeviceDataObject =
                Device.getDataFromTDeviceJSON_DB(dataJSON);
            data.push(newData);
        }

        const newDevice = new Device(
            deviceData._id,
            deviceData.deviceTargetID,
            deviceData.deviceName,
            deviceData.mqttTopicID,
            deviceData.previousTopicID,
            deviceData.isAccepted,
            deviceData.isAdminOnly,
            data,
            deviceData.isConnected,
            deviceData.isConnectedCheck
        );

        return newDevice;
    }

    getAsJson_DB(): TDeviceJSON_DB {
        const data = [];
        for (let index = 0; index < this.data.length; index++) {
            const element = this.data[index];
            data.push(element.getAsJson_DB());
        }
        let json = {
            _id: this._id,
            deviceTargetID:this.deviceTargetID,
            mqttTopicID: this.mqttTopicID,
            previousTopicID: this.previousTopicID,
            isAccepted: this.isAccepted,
            isAdminOnly: this.isAdminOnly,
            data: data,
            deviceName: this.deviceName,
            isConnected: this.isConnected,
            isConnectedCheck: this.isConnectedCheck,
        };

        return json;
    }

    getAsJson(): TDevice {
        let json: TDevice = {
            _id: this._id,
            deviceTargetID:this.deviceTargetID,
            mqttTopicID: this.mqttTopicID,
            previousTopicID: this.previousTopicID,
            isAccepted: this.isAccepted,
            isAdminOnly: this.isAdminOnly,
            data: this.data,
            deviceName: this.deviceName,
            isConnected: this.isConnected,
            isConnectedCheck: this.isConnectedCheck,
        };

        return json;
    }

    private static getNewData(
        dataConfig: DeviceDataTypesConfigs
    ): TDeviceDataObject {
        switch (dataConfig.typeID) {
            case SwitchData.TYPE_ID:
                return SwitchData.createNewData(dataConfig);
            case NumberData.TYPE_ID:
                return NumberData.createNewData(dataConfig);
            case MultiStateButton.TYPE_ID:
                return MultiStateButton.createNewData(dataConfig);
            default:
                const err = `unknown typeID:"${dataConfig.typeID}" at mqttTopicService.ts at getNewData`;
                logEvents(err, ERROR_LOG);
                throw new Error(err);
        }
    }

    private static getDataFromTDeviceJSON_DB(
        dataConfig: DeviceDataTypes
    ): TDeviceDataObject {
        switch (dataConfig.typeID) {
            case SwitchData.TYPE_ID:
                return SwitchData.createDataFromDeviceDataTypes(
                    dataConfig as TSwitchData
                );
            case NumberData.TYPE_ID:
                return NumberData.createDataFromDeviceDataTypes(
                    dataConfig as TNumberData
                );
            case MultiStateButton.TYPE_ID:
                return MultiStateButton.createDataFromDeviceDataTypes(
                    dataConfig as MultiStateButton
                );
            default:
                const err = `unknown typeID:"${dataConfig.typeID}" at mqttTopicService.ts at getDataFromTDeviceJSON_DB`;
                logEvents(err, ERROR_LOG);
                throw new Error(err);
        }
    }
}
