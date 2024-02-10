import { TPropertyCheck, TTaskJSON_DB, TTaskProperty, TTimeCheck, TTodoTask } from "../interfaces/task.interface";
import { Task } from "../models/task"
import { v4 as uuidv4 } from 'uuid';
import { COLLECTION_TASKS, createDocument, getDocument, updateDocument } from "./mongoDBService";
import { ERROR_LOG, logEvents, logger } from "../middleware/logger";
import { UpdateFilter } from "mongodb";
import { addScheduledTask, stopScheduledTask } from "./taskSchedulerService";
import { taskCheckHandler } from "../handlers/taskHandler";

type TaskResult = {
    isSuccessful: false
} | {
    isSuccessful: true
    task: Task
}

export async function createTask(
    taskName: string,
    isOn: boolean = false,
    isRepeating: boolean = false,
    varChecks: TPropertyCheck[] = [],
    timeChecks: TTimeCheck[] = [],
    todoTasks: TTodoTask[] = []
): Promise<TaskResult> {
    let functionResult: TaskResult = { isSuccessful: false }
    const _id = uuidv4()

    // create task and insert into db
    const newTask = Task.createNewTask(_id, taskName, isOn, isRepeating, varChecks, timeChecks, todoTasks)
    const isSuccessful = await createDocument(COLLECTION_TASKS, newTask.getAsJson_DB())

    // check if acknowledged by db
    if (isSuccessful) {
        functionResult = {
            isSuccessful: true,
            task: newTask,
        }
    }
    else {
        functionResult = {
            isSuccessful: false,
        }
    }

    return functionResult
}

export async function getTask(_id: string) {
    let functionResult: TaskResult = { isSuccessful: false }

    //query
    const fillter = { _id: _id }
    const findResultArr = await getDocument<TTaskJSON_DB>(COLLECTION_TASKS, fillter)

    //validation
    if (findResultArr.length > 1) {
        let err = `Multipale documents with _id:${_id} at: taskCollection`
        logEvents(err, ERROR_LOG)
        throw new Error(err)
    }
    else if (findResultArr.length == 0) {
        functionResult = { isSuccessful: false }
    }
    else {
        const queryTask = Task.createTaskFromTTaskJSON_DB(findResultArr[0])
        functionResult = { isSuccessful: true, task: queryTask }
    }

    return functionResult
}

export async function updateTaskProperty(_id: string, propertyList: TTaskProperty[]) {
    for (let i = 0; i < propertyList.length; i++) {
        const element = propertyList[i];
        if (element.taskPropertyName == "propertyChecks") {
            if (element.operation == "add") {
                addPropertyCheck(_id, element)
            }
            else if (element.operation == "update") {
                updatePropertyCheck(_id, element)
            }
            else if (element.operation == "delete") {
                deletePropertyCheck(_id, element)
            }
        }
        else if (element.taskPropertyName == "timeChecks") {
            if (element.operation == "add") {
                addTimeCheck(_id, element)
            }
            else if (element.operation == "update") {
                updateTimeCheck(_id, element)
            }
            else if (element.operation == "delete") {
                deleteTimeCheck(_id, element)
            }
        }
        else if (element.taskPropertyName == "todoTasks") {
            if (element.operation == "add") {
                addTodoTask(_id, element)
            }
            else if (element.operation == "update") {
                updateTodoTask(_id, element)
            }
            else if (element.operation == "delete") {
                deleteTodoTask(_id, element)
            }
        }
        // TODO: add element.taskPropertyName == "taskname"
        // TODO: add element.taskPropertyName == "isOn"
        // TODO: add element.taskPropertyName == "isRepeating"
    }
}

async function addPropertyCheck(taskID: string, propertyItem: TTaskProperty) {
    if (propertyItem.taskPropertyName != "propertyChecks") return
    if (propertyItem.operation != "add") return

    const _id = uuidv4()
    let newPropertyCheck = {
        itemID: _id,
        checkType: propertyItem.checkType,
        dataID: propertyItem.dataID,
        deviceID: propertyItem.deviceID,
        propertyName: propertyItem.propertyName,
        valueToCompare: propertyItem.valueToCompare,
    }

    const updateFilter: UpdateFilter<TTaskJSON_DB> = {
        $push: {
            varChecks: {
                $each: [newPropertyCheck]
            }
        }
    }
    const filter = { _id: taskID }
    await updateDocument(COLLECTION_TASKS, _id, filter, updateFilter)
}

async function updatePropertyCheck(taskID: string, propertyItem: TTaskProperty) {
    if (propertyItem.taskPropertyName != "propertyChecks") return
    if (propertyItem.operation != "update") return

    const filter = {
        _id: taskID,
        "varChecks.itemID": propertyItem.itemID
    }
    const updateFilter = {
        $set: { [`varChecks.$.${propertyItem.checkPropertyName}`]: propertyItem.newValue }
    }
    await updateDocument(COLLECTION_TASKS, taskID, filter, updateFilter)
}

async function deletePropertyCheck(taskID: string, propertyItem: TTaskProperty) {
    if (propertyItem.taskPropertyName != "propertyChecks") return
    if (propertyItem.operation != "delete") return

    const filter = {
        _id: taskID,
    }

    const updateFilter = {
        $pull: {
            varChecks: { itemID: propertyItem.itemID }
        }
    }

    await updateDocument(COLLECTION_TASKS, taskID, filter, updateFilter)
}

async function addTimeCheck(taskID: string, propertyItem: TTaskProperty) {
    if (propertyItem.taskPropertyName != "timeChecks") return
    if (propertyItem.operation != "add") return

    const _id = uuidv4()
    let newTimeCheck = {
        itemID: _id,
        timingData: propertyItem.timingData,
        isTrue: false,
    }

    addScheduledTask(propertyItem.timingData,_id,() =>{taskCheckHandler(taskID)})

    const updateFilter: UpdateFilter<TTaskJSON_DB> = {
        $push: {
            timeChecks: {
                $each: [newTimeCheck]
            }
        }
    }
    const filter = { _id: taskID }
    await updateDocument(COLLECTION_TASKS, _id, filter, updateFilter)
}
async function updateTimeCheck(taskID: string, propertyItem: TTaskProperty) {
    if (propertyItem.taskPropertyName != "timeChecks") return
    if (propertyItem.operation != "update") return

    if(propertyItem.checkPropertyName == "timingDatas") {
        stopScheduledTask(propertyItem.itemID)
        addScheduledTask(propertyItem.newValue,propertyItem.itemID,() =>{taskCheckHandler(taskID)})
    }

    const filter = {
        _id: taskID,
        "timeChecks.itemID": propertyItem.itemID
    }
    const updateFilter = {
        $set: { [`timeChecks.$.${propertyItem.checkPropertyName}`]: propertyItem.newValue }
    }
    await updateDocument(COLLECTION_TASKS, taskID, filter, updateFilter)
}
async function deleteTimeCheck(taskID: string, propertyItem: TTaskProperty) {
    if (propertyItem.taskPropertyName != "timeChecks") return
    if (propertyItem.operation != "delete") return

    stopScheduledTask(propertyItem.itemID)

    const filter = {
        _id: taskID,
    }

    const updateFilter = {
        $pull: {
            timeChecks: { itemID: propertyItem.itemID }
        }
    }

    await updateDocument(COLLECTION_TASKS, taskID, filter, updateFilter)
}

async function addTodoTask(taskID: string, propertyItem: TTaskProperty) {
    if (propertyItem.taskPropertyName != "todoTasks") return
    if (propertyItem.operation != "add") return

    const _id = uuidv4()
    let newTodoTask = {
        itemID: _id,
        deviceID: propertyItem.deviceID,
        dataID: propertyItem.dataID,
        propertyName: propertyItem.propertyName,
        newValue: propertyItem.newValue,
    }
    const updateFilter: UpdateFilter<TTaskJSON_DB> = {
        $push: {
            todoTasks: {
                $each: [newTodoTask]
            }
        }
    }
    const filter = { _id: taskID }
    await updateDocument(COLLECTION_TASKS, _id, filter, updateFilter)
}
async function updateTodoTask(taskID: string, propertyItem: TTaskProperty) {
    if (propertyItem.taskPropertyName != "todoTasks") return
    if (propertyItem.operation != "update") return

    const filter = {
        _id: taskID,
        "todoTasks.itemID": propertyItem.itemID
    }
    const updateFilter = {
        $set: { [`todoTasks.$.${propertyItem.todoPropertyName}`]: propertyItem.newValue }
    }
    await updateDocument(COLLECTION_TASKS, taskID, filter, updateFilter)
}
async function deleteTodoTask(taskID: string, propertyItem: TTaskProperty) {
    if (propertyItem.taskPropertyName != "todoTasks") return
    if (propertyItem.operation != "delete") return

    const filter = {
        _id: taskID,
    }

    const updateFilter = {
        $pull: {
            todoTasks: { itemID: propertyItem.itemID }
        }
    }

    await updateDocument(COLLECTION_TASKS, taskID, filter, updateFilter)
}