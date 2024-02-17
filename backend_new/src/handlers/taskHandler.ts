import { TTask, TTaskProperty } from "../interfaces/task.interface";
import { getDocuments } from "../services/mongoDBService";
import { updateTaskProperty } from "../services/taskService";

// check and execute task
export async function taskCheckHandler(taskID: string) {
    const filter = {_id : taskID}
    const task = await getDocuments<TTask>("tasks",filter);

    console.log(task);
}

// handler for taskSchedulerService to update db timeCheck isTrue property
export function taskTimeCheckHandler(taskID: string, itemID: string) {
    let updateProps: TTaskProperty = {
        taskPropertyName: "timeChecks",
        operation: "update",
        itemID: itemID,
        checkPropertyName: "isTrue",
        newValue: true,
    }
    updateTaskProperty(taskID,[updateProps])

    taskCheckHandler(taskID)
}