import { TDeviceProperty } from "../interfaces/device.interface";
import { DeviceDataTypesConfigs } from "../interfaces/deviceData.interface";
import { TTask, TTaskProperty } from "../interfaces/task.interface";
import { Task } from "../models/task";
import * as DeviceService from "../services/deviceService";
import { getDocuments } from "../services/mongoDBService";
import { updateTaskProperty } from "../services/taskService";

// check and execute task
export async function taskCheckHandler(taskID: string) {
    const filter = { _id: taskID }
    const task = (await getDocuments<TTask>("tasks", filter))[0];

    for (let i = 0; i < task.propertyChecks.length; i++) {
        const element = task.propertyChecks[i];
        const device = await DeviceService.getDevice(element.deviceID);
        if (!device.isSuccessful) return;

        const data = device.device.data[element.dataID]

        // @ts-ignore // is because element.propertyName is any and not a property name of data for sure
        const variableToCheck = data[element.propertyName]
        if (typeof variableToCheck == undefined) return

        switch (element.checkType) {
            case Task.CHECK_TYPE_EQUAL:
                if (!checkEqual(variableToCheck, element.valueToCompare)) return
            case Task.CHECK_TYPE_LESS_THEN:
                if (!checkMoreThen(variableToCheck, element.valueToCompare)) return
            case Task.CHECK_TYPE_MORE_THEN:
                if (!checkLessThen(variableToCheck, element.valueToCompare)) return
            case Task.CHECK_TYPE_ANY:
                if (!checkAny()) return
        }
    }

    for (let i = 0; i < task.timeChecks.length; i++) {
        const element = task.timeChecks[i];
        if (!element.isTrue) return
    }

    for (let i = 0; i < task.todoTasks.length; i++) {
        const element = task.todoTasks[i];
        let update = {
            propertyName : element.propertyName,
            newValue : element.newValue
        }
    }
    // do the todo list
    // turn off if is not repeating
    console.log("test");
}

function checkEqual(value: any, valueToCompare: any) {
    return value == valueToCompare
}
function checkMoreThen(value: any, valueToCompare: any) {
    return value == valueToCompare
}
function checkLessThen(value: any, valueToCompare: any) {
    return value == valueToCompare
}
function checkAny() {
    return true
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
    updateTaskProperty(taskID, [updateProps])

    taskCheckHandler(taskID)
}