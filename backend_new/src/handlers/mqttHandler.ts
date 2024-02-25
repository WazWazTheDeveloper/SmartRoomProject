import { TDeviceDataDeviceProperties } from "../interfaces/deviceData.interface";
import {
    TAllMqttMessageType,
    TConnectionCheckResponse,
    TGetDeviceRequest,
    TGetDeviceResponse,
    TInitDeviceRequest,
    TInitDeviceRespone,
    TUpdateDataFromDeviceRequest,
    TUpdateDataToDeviceResponse,
} from "../interfaces/mqttMassge.interface";
import { MQTT_LOG, logEvents } from "../middleware/logger";
import * as DeviceService from "../services/deviceService";
import { publishMessage } from "../services/mqttClientService";
import SwitchData from "../models/dataTypes/switchData";

/**
 * @description supposed to be called by the mqtt client when a message is recived and routes the message to the correct funciton
 * @param topic mqtt topic that published the message
 * @param message message send via mqtt
 * @returns void
 */
export function mqttMessageHandler(
    topic: string,
    message: TAllMqttMessageType
) {
    console.log(topic);
    console.log(message);
    if (typeof topic != "string") return;
    if (!message) return;
    if (message.origin == "server") return;

    if (message.operation == "initDevice") {
        initDevice(topic, message as TInitDeviceRequest);
    }

    if (topic == process.env.MQTT_TOPIC_INIT_DEVICE) return;

    switch (message.operation) {
        case "getDevice":
            getDevice(topic, message as TGetDeviceRequest);
            break;
        case "updateDevice":
            updateDevice(topic, message as TUpdateDataToDeviceResponse);
            break;
        case "updateServer":
            updateServer(topic, message as TUpdateDataFromDeviceRequest);
            break;
        case "checkConnection":
            checkConnection(topic, message as TConnectionCheckResponse);
            break;
        default:
            //@ts-ignore
            let logItem = `unknown operation: ${message.operation}`;
            logEvents(logItem, MQTT_LOG);
    }
}

/**
 * @description handles device initialization requests recived via mqtt server
 * @param topic mqtt topic that published the message
 * @param message message send via mqtt
 * @returns void
 */
async function initDevice(topic: string, message: TInitDeviceRequest) {
    if (typeof topic != "string") return;
    if (topic != (process.env.MQTT_TOPIC_INIT_DEVICE as string)) return; //init device should only be called on initDevice topic
    if (!message) return;
    if (message.operation != "initDevice") return;
    if (typeof message.origin != "string") return;
    if (!Array.isArray(message.dataTypeArray)) return;
    for (let i = 0; i < message.dataTypeArray.length; i++) {
        const element = message.dataTypeArray[i];
        if (typeof element.dataID != "number") return;
        if (typeof element.typeID != "number") return;
    }

    let deviceName = "new device";
    if (typeof message.deviceName == "string") {
        deviceName = message.deviceName;
    }

    let result = await DeviceService.createDevice(
        deviceName,
        message.dataTypeArray
    );
    if (result.isSuccessful) {
        const response: TInitDeviceRespone = {
            isSuccessful: true,
            operation: "initDevice",
            origin: "server",
            target: message.origin,
            _id: result.device._id,
        };
        publishMessage(topic, response);
    } else {
        const response: TInitDeviceRespone = {
            isSuccessful: false,
            operation: "initDevice",
            origin: "server",
            target: message.origin,
        };
        publishMessage(topic, response);
    }
}

/**
 * @description handles device powerup requests to recived data via mqtt server
 * @param topic mqtt topic that published the message
 * @param message message send via mqtt
 * @returns void
 */
async function getDevice(topic: string, message: TGetDeviceRequest) {
    if (typeof topic != "string") return;
    if (!message) return;
    if (message.operation != "getDevice") return;
    if (typeof message.deviceID != "string") return;
    if (typeof message.origin != "string") return;

    const result = await DeviceService.getDevice(message.deviceID);
    if (result.isSuccessful) {
        //get all topics from device
        const dataArr: TDeviceDataDeviceProperties[] = [];
        for (let i = 0; i < result.device.data.length; i++) {
            const data = result.device.data[i];
            dataArr.push({
                mqttPrimeryTopicID: data.mqttPrimeryTopicID,
                // mqttSecondaryTopicID: data.mqttSecondaryTopicID,
                dataID: data.dataID,
            });
        }
        const response: TGetDeviceResponse = {
            origin: "server",
            isSuccessful: true,
            deviceID: message.deviceID,
            operation: "getDevice",
            mqttPrimeryTopicID: result.device.mqttTopicID,
            data: dataArr,
        };
        publishMessage(topic, response);
    } else {
        const response: TGetDeviceResponse = {
            origin: "server",
            isSuccessful: false,
            deviceID: message.deviceID,
            operation: "getDevice",
        };
        publishMessage(topic, response);
    }
}

async function updateDevice(
    topic: string,
    message: TUpdateDataToDeviceResponse
) {
    if (typeof topic != "string") return;
    if (!message) return;
    if (message.operation != "updateDevice") return;
}

async function updateServer(
    topic: string,
    message: TUpdateDataFromDeviceRequest
) {
    if (typeof topic != "string") return;
    if (!message) return;
    if (message.operation != "updateServer") return;
    if (typeof message.deviceID != "string") return;
    if (typeof message.origin != "string") return;
    if (typeof message.dataID != "number") return;
    if (typeof message.typeID != "number") return;

    const update: DeviceService.TUpdateDeviceProperties = {
        _id: message.deviceID,
        propertyToChange: {
            dataID: message.dataID,
            // @ts-ignore
            typeID: message.typeID,
            propertyName: "data",
            dataPropertyName: message.dataPropertyName,
            newValue: message.newValue,
        },
    };

    await DeviceService.updateDeviceProperties([update]);
}

async function checkConnection(
    topic: string,
    message: TConnectionCheckResponse
) {
    if (typeof topic != "string") return;
    if (!message) return;
    if (message.operation != "checkConnection") return;
}
