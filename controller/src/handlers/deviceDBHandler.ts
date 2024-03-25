import * as mongoDB from "mongodb";
import {
    COLLECTION_TASKS,
    getDocuments,
} from "../services/mongoDBService";
import { TTask } from "../interfaces/task.interface";
import { taskCheckHandler } from "./taskHandler";
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
    deviceTaskHandler(changeEvent);
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

/**
 * @description -
 * the function calls a task check for tasks
 * that are listening to updates from the updated device
 * 
 * @param changeEvent - a change event form mongodb
 * @returns 
 */
async function deviceTaskHandler(changeEvent: mongoDB.ChangeStreamDocument) {
    if (changeEvent.operationType != "update") return;
    if (!changeEvent.updateDescription.updatedFields) return;

    const changedDeviceID = changeEvent.documentKey._id;
    const filter = {
        propertyChecks: {
            $elemMatch: {
                deviceID: changedDeviceID,
            },
        },
    };

    const project = {
        _id: 1,
    };

    const tasksIDs = await getDocuments<TTask>(
        COLLECTION_TASKS,
        filter,
        project
    );

    for (let index = 0; index < tasksIDs.length; index++) {
        const element = tasksIDs[index];
        taskCheckHandler(element._id);
    }
}
