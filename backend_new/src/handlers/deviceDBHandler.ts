import * as mongoDB from "mongodb";
import { COLLECTION_DEVICES, COLLECTION_TASKS, getDocuments } from "../services/mongoDBService";
import { TTask } from "../interfaces/task.interface";
import { taskCheckHandler } from "./taskHandler";

export async function deviceDBHandler(changeEvent: mongoDB.ChangeStreamDocument) {
    deviceTaskHandler(changeEvent)
    updateDevice(changeEvent)
    setupDevice(changeEvent)
}

async function setupDevice(changeEvent: mongoDB.ChangeStreamDocument) {
    if(changeEvent.operationType != "insert") return
    // subscribe to topics and stuff
}

// check if there is a need to update the device and if so updates it
async function updateDevice(changeEvent: mongoDB.ChangeStreamDocument) {
    console.log("changeEvent")
    console.log(changeEvent)
}

// checks if updated field is a property check of a task and if so call taskCheckHandler()
async function deviceTaskHandler(changeEvent: mongoDB.ChangeStreamDocument) {
    if (changeEvent.operationType != "update") return
    if (!changeEvent.updateDescription.updatedFields) return

    // TODO: move this to task service
    const changed = Object.keys(changeEvent.updateDescription.updatedFields)

    const changedDeviceID = changeEvent.documentKey._id
    const filter = {
        propertyChecks: {
            $elemMatch: {
                deviceID: changedDeviceID
            }
        }

    }

    const project = {
        _id: 1,
    }

    const tasksIDs = await getDocuments<TTask>(COLLECTION_TASKS, filter, project)

    for (let index = 0; index < tasksIDs.length; index++) {
        const element = tasksIDs[index];
        taskCheckHandler(element._id);
    }
}