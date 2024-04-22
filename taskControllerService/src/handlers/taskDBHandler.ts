import * as mongoDB from "mongodb";
import { addScheduledTask, stopScheduledTask } from "../services/taskSchedulerService";
import { taskTimeCheckHandler } from "./taskHandler";

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
    if (!changeEvent.updateDescription.updatedFields.timeChecks) return;

    if(Array.isArray(changeEvent.updateDescription.updatedFields["timeChecks"])){
        // $pull
        for (let index = 0; index < changeEvent.updateDescription.updatedFields.length; index++) {
            const element = changeEvent.updateDescription.updatedFields[index];
            stopScheduledTask(element.itemID);
        }
    }
    else {
        // update of added
        let keys = Object.keys(Array.isArray(changeEvent.updateDescription.updatedFields["timeChecks"]))
        for (let i = 0; i < keys.length; i++) {
            const element = changeEvent.updateDescription.updatedFields[keys[i]];
            stopScheduledTask(element.itemID);
            addScheduledTask(element.timingData,element.itemID,() => { taskTimeCheckHandler(changeEvent._id as string, element.itemID)})
        }
    }
}
