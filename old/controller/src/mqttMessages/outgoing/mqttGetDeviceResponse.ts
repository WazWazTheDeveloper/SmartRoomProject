import { TDeviceDataObject } from "../../interfaces/device.interface";
import { TDeviceDataDeviceProperties } from "../../interfaces/deviceData.interface";
import { TGetDeviceRequest, TGetDeviceResponse } from "../../interfaces/mqttMassge.interface";
import MultiStateButton from "../../models/dataTypes/multiStateButtonData";
import NumberData from "../../models/dataTypes/numberData";
import SwitchData from "../../models/dataTypes/switchData";
import * as DeviceService from "../../services/deviceService";
import { publishMessage } from "../../services/mqttClientService";
import { getMqttTopic } from "../../services/mqttTopicService";

/**
 * @description send device props via mqtt
 * @param topic mqtt topic that published the message
 * @param message message send via mqtt
 * @returns void
 */
export async function sendDevicePropertiesMQTTRequest(topic: string, message: TGetDeviceRequest) {
    const result = await DeviceService.getDevice(message.deviceID);
    if (!result.isSuccessful) {
        returnFalse(topic, message)
        return
    }

    const topicPathResult = await getMqttTopic(result.device.mqttTopicID)
    if (!topicPathResult.isSuccessful) {
        returnFalse(topic, message)
        return
    }

    //get all topics from device
    const dataArr: TDeviceDataDeviceProperties[] = [];
    for (let i = 0; i < result.device.data.length; i++) {
        const data = result.device.data[i];

        const dataTopicPathResult = await getMqttTopic(data.mqttTopicID)
        if (!dataTopicPathResult.isSuccessful) {
            returnFalse(topic, message);
            return;
        }

        dataArr.push({
            mqttTopicPath: dataTopicPathResult.mqttTopicObject.path,
            dataID: data.dataID,
            typeID: data.typeID,
            value: getData(data)
        });
    }
    const response: TGetDeviceResponse = {
        origin: "server",
        isSuccessful: true,
        deviceID: message.deviceID,
        operation: "getDevice",
        // mqttTopicID: result.device.mqttTopicID,
        mqttTopic: topicPathResult.mqttTopicObject.path,
        data: dataArr,
    };
    publishMessage(topic, response);
}

function returnFalse(topic: string, message: TGetDeviceRequest) {
    const response: TGetDeviceResponse = {
        origin: "server",
        isSuccessful: false,
        deviceID: message.deviceID,
        operation: "getDevice",
    };
    publishMessage(topic, response);
}

/**
 * @description send device props via mqtt
 * @param topic mqtt topic that published the message
 * @param message message send via mqtt
 * @returns void
 */
export async function sendDevicePropertiesOfDevice(topic: string, deviceID: string) {
    const result = await DeviceService.getDevice(deviceID);
    if (!result.isSuccessful) {
        return
    }
    const topicPathResult = await getMqttTopic(result.device.mqttTopicID)
    if (!topicPathResult.isSuccessful) {
        return
    }
    //get all topics from device
    const dataArr: TDeviceDataDeviceProperties[] = [];
    for (let i = 0; i < result.device.data.length; i++) {
        const data = result.device.data[i];

        const dataTopicPathResult = await getMqttTopic(data.mqttTopicID)
        if (!dataTopicPathResult.isSuccessful) {
            return;
        }

        dataArr.push({
            mqttTopicPath: dataTopicPathResult.mqttTopicObject.path,
            dataID: data.dataID,
            typeID: data.typeID,
            value: getData(data)
        });
    }

    const response: TGetDeviceResponse = {
        origin: "server",
        isSuccessful: true,
        deviceID: deviceID,
        operation: "getDevice",
        mqttTopic: topicPathResult.mqttTopicObject.path,
        // mqttTopicID: result.device.mqttTopicID,
        data: dataArr,
    };
    publishMessage(topic, response);
}


function getData(deviceData: TDeviceDataObject) {
    switch (deviceData.typeID) {
        case (SwitchData.TYPE_ID):
            return deviceData.isOn
        case (NumberData.TYPE_ID):
            return deviceData.currentValue
        case (MultiStateButton.TYPE_ID):
            return deviceData.currentState
    }
}