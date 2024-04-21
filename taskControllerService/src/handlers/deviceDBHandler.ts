import * as mongoDB from "mongodb";
import {
    COLLECTION_TASKS,
    getDocuments,
} from "../services/mongoDBService";
import { TTask } from "../interfaces/task.interface";
import { taskCheckHandler } from "./taskHandler";

/**
 * @description - calls sub functions that handle the device collection changes
 * 
 * @param changeEvent - a change event form mongodb
 */
export async function deviceDBHandler(changeEvent: mongoDB.ChangeStreamDocument) {
    deviceTaskHandler(changeEvent);
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
