import { TDataObject, TDevice, TDeviceJSON_DB } from '../interfaces/device.interface';
import SwitchData from './dataTypes/switchData';
import { DeviceDataTypesConfigs } from '../interfaces/deviceData.interface';
import { ERROR_LOG, logEvents } from '../middleware/logger';

export default class Device implements TDevice {
    static readonly DEVICE_ACCEPTED_YES = 1
    static readonly DEVICE_ACCEPTED_NO = -1
    static readonly DEVICE_ACCEPTED_UNDEFINED = 0


    // types
    static readonly SWITCH_TYPE = 0;
    static readonly NUMBER_TYPE = 1;
    static readonly MULTI_STATE_BUTTON_TYPE = 2;

    _id: string
    mqttTopicID: string
    isAccepted: -1 | 0 | 1
    isAdminOnly: boolean
    data: (TDataObject)[]

    constructor(_id: string, mqttTopicID: string, dataTypeArray: DeviceDataTypesConfigs[]) {
        const isAccepted = Device.DEVICE_ACCEPTED_UNDEFINED
        const isAdminOnly = false;
        const data: (TDataObject)[] = []

        for (let dataID = 0; dataID < dataTypeArray.length; dataID++) {
            const dataConfig = dataTypeArray[dataID];
            const newData: TDataObject = this.getNewData(dataConfig);
            data.push(newData)
        }

        this._id = _id;
        this.mqttTopicID = mqttTopicID;
        this.isAccepted = isAccepted;
        this.isAdminOnly = isAdminOnly;
        this.data = data;

    }

    getAsJson_DB(): TDeviceJSON_DB {
        const data = []
        for (let index = 0; index < this.data.length; index++) {
            const element = this.data[index];
            data.push(element.getAsJson_DB())
        }
        let json = {
            _id: this._id,
            mqttTopicID: this.mqttTopicID,
            isAccepted: this.isAccepted,
            isAdminOnly: this.isAdminOnly,
            data: data,
        }

        return json
    }

    getAsJson(): TDevice {
        let json: TDevice = {
            _id: this._id,
            mqttTopicID: this.mqttTopicID,
            isAccepted: this.isAccepted,
            isAdminOnly: this.isAdminOnly,
            data: this.data,
        }

        return json
    }

    getNewData(dataConfig: DeviceDataTypesConfigs): TDataObject {
        switch (dataConfig.typeID) {
            case SwitchData.TYPE_ID:
                return SwitchData.createData(dataConfig);
            default:
                const err = `unknown typeID:"${dataConfig.typeID}" at mqttTopicService.ts line:7`
                logEvents(err, ERROR_LOG)
                throw new Error(err)
        }
    }
}