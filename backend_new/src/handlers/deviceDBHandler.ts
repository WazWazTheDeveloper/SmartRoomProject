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

export async function deviceDBHandler(
    changeEvent: mongoDB.ChangeStreamDocument
) {
    deviceTaskHandler(changeEvent);
    updateDevice(changeEvent);
    setupDevice(changeEvent);
}

async function setupDevice(changeEvent: mongoDB.ChangeStreamDocument) {
    if (changeEvent.operationType != "insert") return;
    if (typeof changeEvent.fullDocument.mqttTopicID != "string") return;
    try {
        let topicResult = await MqttTopicService.getMqttTopic(
            changeEvent.fullDocument.mqttTopicID
            );
            if (topicResult.isSuccessful) {
            MqttClientService.subscribeToTopic(topicResult.mqttTopicObject.path);
        } else {
            // TODO: add error
        }
    } catch (e) {
        // TODO: add error
    }
    // subscribe to topics and stuff
}

// check if there is a need to update the device and if so updates it
async function updateDevice(changeEvent: mongoDB.ChangeStreamDocument) {
    console.log("changeEvent");
}

// checks if updated field is a property check of a task and if so call taskCheckHandler()
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
