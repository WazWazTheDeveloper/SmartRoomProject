import * as mongoDB from "mongodb";
import { stopScheduledTask } from "../services/taskSchedulerService";

/**
 * @description - calls sub functions that handle the device collection changes
 * 
 * @param changeEvent - a change event form mongodb
 */
export async function taskDBHandler(changeEvent: mongoDB.ChangeStreamDocument) {
    handleTimeCheckChange(changeEvent);
}

async function handleTimeCheckChange(changeEvent: mongoDB.ChangeStreamDocument) {
    if (changeEvent.operationType != "update") return;
    if (!changeEvent.updateDescription.updatedFields) return;
    if (!changeEvent.updateDescription.updatedFields.propertyChecks) return;

    if(Array.isArray(changeEvent.updateDescription.updatedFields["propertyChecks"])){
        // $pull
        for (let index = 0; index < changeEvent.updateDescription.updatedFields.length; index++) {
            const element = changeEvent.updateDescription.updatedFields[index];
            stopScheduledTask(element.itemID);
        }
    }
    else {
        // update of added
    }
}
