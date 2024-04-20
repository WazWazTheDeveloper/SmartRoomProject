import * as mongoDB from "mongodb";
import {
    getDocuments,
} from "../services/mongoDBService";
import { subscribeToNewDevice } from "./mqttDeviceSubscriptionsHandler";
import { updateDeviceData } from "../mqttMessages/outgoing/mqttUpdateDeviceDataRequest";
import * as DeviceService from "../services/deviceService";
import * as MqttTopicService from "../services/mqttTopicService";
import { sendDevicePropertiesOfDevice } from "../mqttMessages/outgoing/mqttGetDeviceResponse";

/**
 * @description - calls sub functions that handle the device collection changes
 * 
 * @param changeEvent - a change event form mongodb
 */
export async function deviceDBHandler(changeEvent: mongoDB.ChangeStreamDocument) {
    subscribeToNewDevice(changeEvent);
    onUpdateDevice(changeEvent);
}

async function onUpdateDevice(changeEvent: mongoDB.ChangeStreamDocument) {
    if (changeEvent.operationType != "update") return;
    if (!changeEvent.updateDescription.updatedFields) return;

    // get device to update
    const deviceResult = await DeviceService.getDevice(
        String(changeEvent.documentKey._id)
    );
    if (!deviceResult.isSuccessful) return;
    const curDevice = deviceResult.device;

    // get data to update
    const updatedFieldKeys = Object.keys(
        changeEvent.updateDescription.updatedFields
    );

    for (let i = 0; i < updatedFieldKeys.length; i++) {
        const key = updatedFieldKeys[i];
        const keyVals: string[] = key.split(".");
        if (keyVals[0] == "data") {
            if (keyVals[2] != "mqttTopicID") {
                const dataIndex = Number(keyVals[1]); //place at data array
                const topicID = curDevice.data[dataIndex].mqttTopicID;

                //get topic
                const topicResult = await MqttTopicService.getMqttTopic(topicID);
                if (!topicResult.isSuccessful) return
                const topic = topicResult.mqttTopicObject.path;

                updateDeviceData(topic, curDevice, dataIndex, keyVals[2])
            } else {
                //update data topics
                //get topic
                const topicID = curDevice.mqttTopicID;
                const topicResult = await MqttTopicService.getMqttTopic(
                    topicID
                );
                if (!topicResult.isSuccessful) continue;
                const topic = topicResult.mqttTopicObject.path;

                sendDevicePropertiesOfDevice(topic, String(changeEvent.documentKey._id));
            }
        } else {
            if (keyVals[0] == "previousTopicID") {
                //get topic
                const topicID = curDevice.previousTopicID;
                const topicResult = await MqttTopicService.getMqttTopic(
                    topicID
                );
                if (!topicResult.isSuccessful) continue;
                const topic = topicResult.mqttTopicObject.path;

                sendDevicePropertiesOfDevice(topic, String(changeEvent.documentKey._id));
            }
        }
    }
}