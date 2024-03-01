import * as mongoDB from "mongodb";
import {
    COLLECTION_DEVICES,
    COLLECTION_TASKS,
    getDocuments,
} from "../services/mongoDBService";
import { TTask } from "../interfaces/task.interface";
import { taskCheckHandler } from "./taskHandler";
import * as MqttTopicService from "../services/mqttTopicService";
import * as MqttClientService from "../services/mqttClientService";
import * as DeviceService from "../services/deviceService";
import { subscribeToNewDevice } from "./mqttDeviceSubscriptionsHandler";
import SwitchData from "../models/dataTypes/switchData";
import NumberData from "../models/dataTypes/numberData";
import MultiStateButton from "../models/dataTypes/multiStateButtonData";

/**
 * @description - calls sub functions that handle the device collection changes
 * 
 * @param changeEvent - a change event form mongodb
 */
export async function deviceDBHandler(changeEvent: mongoDB.ChangeStreamDocument) {
    deviceTaskHandler(changeEvent); // done
    subscribeToNewDevice(changeEvent); //done
    onUpdateDevice(changeEvent);
}

// check if there is a need to update the device and if so updates it
//IMPLEMENT
async function onUpdateDevice(changeEvent: mongoDB.ChangeStreamDocument) {
    console.log("changeEvent");
    console.log(changeEvent);

    if(changeEvent.operationType != "update") return
    if(!changeEvent.updateDescription.updatedFields) return

    const deviceResult = await DeviceService.getDevice(String(changeEvent.documentKey._id))
    if(!deviceResult.isSuccessful) return

    const curDevice = deviceResult.device

    const updatedFieldKeys = Object.keys(changeEvent.updateDescription.updatedFields)

    const updateList = []
    for (let i = 0; i < updatedFieldKeys.length; i++) {
        const key = updatedFieldKeys[i];
        console.log(changeEvent.updateDescription.updatedFields[key])
        const keyVals:string[] = key.split(".")
        if(keyVals[0] == "data") {
            const at = Number(keyVals[1])
            const dataID = curDevice.data[at].dataID;
            const typeID = curDevice.data[at].typeID;
            const dataPropertyName = getDataPropertyName(typeID)
            if(keyVals[2] != dataPropertyName) continue

            const topicID = curDevice.data[at].mqttPrimeryTopicID;
            const topicResult = await MqttTopicService.getMqttTopic(topicID)
            if(!topicResult.isSuccessful) continue
            const topic = topicResult.mqttTopicObject.path
            //@ts-ignore
            const data:string | number = curDevice.data[at][dataPropertyName]
            MqttClientService.publishMessage(topic,data)
        }
    }
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

    // TODO: move this to task service
    const changed = Object.keys(changeEvent.updateDescription.updatedFields);

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
