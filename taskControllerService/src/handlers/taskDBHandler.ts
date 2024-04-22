import * as mongoDB from "mongodb";
import { addScheduledTask, scheduledTasks, stopScheduledTask, stopScheduledTaskOfTask } from "../services/taskSchedulerService";
import { taskTimeCheckHandler } from "./taskHandler";
import { getTask } from "../services/taskService";

/**
 * @description - calls sub functions that handle the device collection changes
 * 
 * @param changeEvent - a change event form mongodb
 */
export async function taskDBHandler(changeEvent: mongoDB.ChangeStreamDocument) {
    handleTimeCheckChange(changeEvent);
}

async function handleTimeCheckChange(changeEvent: mongoDB.ChangeStreamDocument) {
    await onTimedCheckUpdate(changeEvent)
    await onIsOnUpdate(changeEvent)
}

async function onIsOnUpdate(changeEvent: mongoDB.ChangeStreamDocument) {
    if (changeEvent.operationType != "update") return;
    if (!changeEvent.updateDescription.updatedFields) return;
    if (!changeEvent.updateDescription.updatedFields.inOn) return;

    const taskID = String(changeEvent.documentKey._id)

    if (changeEvent.updateDescription.updatedFields.inOn) {
        const taskResult = await getTask(taskID)
        if (!taskResult.isSuccessful) return
        const task = taskResult.task
        if (task.isOn) {
            for (let j = 0; j < task.timeChecks.length; j++) {
                const timeCheck = task.timeChecks[j];
                addScheduledTask(timeCheck.timingData, timeCheck.itemID, task._id, () => { taskTimeCheckHandler(task._id, timeCheck.itemID) })
            }
        }
    } else {
        stopScheduledTaskOfTask(taskID);
    }
}

async function onTimedCheckUpdate(changeEvent: mongoDB.ChangeStreamDocument) {
    if (changeEvent.operationType != "update") return;
    if (!changeEvent.updateDescription.updatedFields) return;
    const taskID = String(changeEvent.documentKey._id)

    let keys = Object.keys(changeEvent.updateDescription.updatedFields)
    let isTimeChecks = false
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (key.includes("timeChecks")) {
            isTimeChecks = true;
        }
    }

    // stop all scheduled tasks assosited with task
    stopScheduledTaskOfTask(taskID);

    // get task and reinstate all tasks
    // this is done because mongodb changeEvent object doesn't tell us which object has been removed from
    // subarray explicitly and I relly dont want to implement someting complex as a work around as i shouldn't be a problem in the futrue
    const taskResult = await getTask(taskID)
    if (!taskResult.isSuccessful) return
    const task = taskResult.task
    if (task.isOn) {
        for (let j = 0; j < task.timeChecks.length; j++) {
            const timeCheck = task.timeChecks[j];
            addScheduledTask(timeCheck.timingData, timeCheck.itemID, task._id, () => { taskTimeCheckHandler(task._id, timeCheck.itemID) })
        }
    }
}
