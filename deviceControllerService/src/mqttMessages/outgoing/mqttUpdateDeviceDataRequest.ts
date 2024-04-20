import * as mongoDB from "mongodb";
import * as DeviceService from "../../services/deviceService";
import * as MqttClientService from "../../services/mqttClientService";
import * as MqttTopicService from "../../services/mqttTopicService";
import SwitchData from "../../models/dataTypes/switchData";
import NumberData from "../../models/dataTypes/numberData";
import MultiStateButton from "../../models/dataTypes/multiStateButtonData";
import { sendDevicePropertiesOfDevice } from "./mqttGetDeviceResponse";
import Device from "../../models/device";

/**
 * @description - updates device data via mqtt after db is updated
 *
 * @param changeEvent - a change event form mongodb
 * @returns
 */
export async function updateDeviceData(topic: string, device: Device, dataIndex: number, updatedPropertyName: string) {
    const typeID = device.data[dataIndex].typeID; //get type of data
    const dataPropertyName = getDataPropertyName(typeID); //get propertyname to update
    if (updatedPropertyName != dataPropertyName) return

    // get data
    //@ts-ignore
    let data: string | number | boolean = device.data[dataIndex][dataPropertyName];

    // convert boolean to int
    if(typeof data == "boolean") {
        data = data ? 1 : 0;
    }

    MqttClientService.publishMessage(topic, data);
}

function getDataPropertyName(typeID: number) {
    switch (typeID) {
        case SwitchData.TYPE_ID:
            return "isOn";
        case NumberData.TYPE_ID:
            return "currentValue";
        case MultiStateButton.TYPE_ID:
            return "currentState";
        default:
            return undefined;
    }
}
