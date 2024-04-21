import { TPropertyCheck, TTask, TTaskJSON_DB, TTaskProperty, TTimeCheck, TTodoTask } from "../interfaces/task.interface";
import { Task } from "../models/task"
import { v4 as uuidv4 } from 'uuid';
import { COLLECTION_TASKS, createDocument, deleteDocuments, getCollection, getDocuments, updateDocument, updateDocuments } from "./mongoDBService";
import { UpdateFilter } from "mongodb";
import { addScheduledTask, stopScheduledTask } from "./taskSchedulerService";
import { taskTimeCheckHandler } from "../handlers/taskHandler";
import { loggerGeneral } from "./loggerService";
import * as mongoDB from "mongodb";

type TaskResult = {
    isSuccessful: false
} | {
    isSuccessful: true
    task: Task
}

export async function initializeTaskHandler(handler: (changeEvent: mongoDB.ChangeStreamDocument) => void) {
    let collection: mongoDB.Collection<TTaskJSON_DB>;
    try {
        collection = (await getCollection(
            "tasks"
        )) as mongoDB.Collection<TTaskJSON_DB>;
    } catch (e) {
        let logItem = `Failed to initialize device handler: ${e}`;
        loggerGeneral.error(logItem, { uuid: "server-startup" })
        return false;
    }

    const changeStream = collection.watch();
    changeStream.on("change", handler);
    
    return true;
}

export async function initializeTasksFromDB(handler: Function) {
    const filter = {
        $expr: {
            $gt: [{ $size: "$timeChecks" }, 0]
        }
    }

    const project = {
        _id: 1,
        isOn: 1,
        timeChecks: 1,
    }


    const tasks: TTask[] = await getDocuments("tasks", filter, project)

    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        if (task.isOn) {
            for (let j = 0; j < task.timeChecks.length; j++) {
                const timeCheck = task.timeChecks[j];
                addScheduledTask(timeCheck.timingData, timeCheck.itemID, () => { taskTimeCheckHandler(task._id, timeCheck.itemID) })
            }
        }
    }
}

export async function createTask(
    taskName: string,
    isOn: boolean = false,
    isRepeating: boolean = false,
    propertyChecks: TPropertyCheck[] = [],
    timeChecks: TTimeCheck[] = [],
    todoTasks: TTodoTask[] = []
): Promise<TaskResult> {
    let functionResult: TaskResult = { isSuccessful: false }
    const _id = uuidv4()

    // create task and insert into db
    const newTask = Task.createNewTask(_id, taskName, isOn, isRepeating, propertyChecks, timeChecks, todoTasks)
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
    const findResultArr = await getDocuments<TTaskJSON_DB>(COLLECTION_TASKS, fillter)

    //validation
    if (findResultArr.length > 1) {
        let err = `Multipale documents with _id:${_id} at: taskCollection`
        loggerGeneral.error(err,{uuid : "taskControllerService"})
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
        else if (element.taskPropertyName == "isOn") {
            updateIsOn(_id, element)
        }
        else if (element.taskPropertyName == "isRepeating") {
            updateIsRepeating(_id, element)
        }
        else if (element.taskPropertyName == "taskName") {
            updateTaskName(_id, element)
        }
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
            propertyChecks: {
                $each: [newPropertyCheck]
            }
        }
    }
    const filter = { _id: taskID }
    await updateDocument(COLLECTION_TASKS, filter, updateFilter)
}

async function updatePropertyCheck(taskID: string, propertyItem: TTaskProperty) {
    if (propertyItem.taskPropertyName != "propertyChecks") return
    if (propertyItem.operation != "update") return

    const filter = {
        _id: taskID,
        "propertyChecks.itemID": propertyItem.itemID
    }
    const updateFilter = {
        $set: { [`propertyChecks.$.${propertyItem.checkPropertyName}`]: propertyItem.newValue }
    }
    await updateDocument(COLLECTION_TASKS, filter, updateFilter)
}

async function deletePropertyCheck(taskID: string, propertyItem: TTaskProperty) {
    if (propertyItem.taskPropertyName != "propertyChecks") return
    if (propertyItem.operation != "delete") return

    const filter = {
        _id: taskID,
    }

    const updateFilter = {
        $pull: {
            propertyChecks: { itemID: propertyItem.itemID }
        }
    }

    await updateDocument(COLLECTION_TASKS, filter, updateFilter)
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

    // get state of task
    const isOnFilter = { _id: taskID }
    const project = {
        isOn: 1,
    }
    const taskIsOn = await getDocuments<TTask>("tasks", isOnFilter, project)

    //create scheduled task is task is on
    if (taskIsOn[0].isOn) {
        addScheduledTask(propertyItem.timingData, _id, () => { taskTimeCheckHandler(taskID, _id) })
    }

    console.log(taskIsOn)
    const updateFilter: UpdateFilter<TTaskJSON_DB> = {
        $push: {
            timeChecks: {
                $each: [newTimeCheck]
            }
        }
    }
    const filter = { _id: taskID }
    await updateDocument(COLLECTION_TASKS, filter, updateFilter)
}
async function updateTimeCheck(taskID: string, propertyItem: TTaskProperty) {
    if (propertyItem.taskPropertyName != "timeChecks") return
    if (propertyItem.operation != "update") return

    // get state of task
    const isOnFilter = { _id: taskID }
    const project = {
        isOn: 1,
    }
    const taskIsOn = await getDocuments<TTask>("tasks", isOnFilter, project)

    if (propertyItem.checkPropertyName == "timingDatas" && taskIsOn) {
        stopScheduledTask(propertyItem.itemID)
        addScheduledTask(propertyItem.newValue, propertyItem.itemID, () => { taskTimeCheckHandler(taskID, propertyItem.itemID) })
    }

    const filter = {
        _id: taskID,
        "timeChecks.itemID": propertyItem.itemID
    }
    const updateFilter = {
        $set: { [`timeChecks.$.${propertyItem.checkPropertyName}`]: propertyItem.newValue }
    }
    await updateDocument(COLLECTION_TASKS, filter, updateFilter)
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

    await updateDocument(COLLECTION_TASKS, filter, updateFilter)
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
    await updateDocument(COLLECTION_TASKS, filter, updateFilter)
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
    await updateDocument(COLLECTION_TASKS, filter, updateFilter)
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

    await updateDocument(COLLECTION_TASKS, filter, updateFilter)
}

async function updateIsOn(taskID: string, propertyItem: TTaskProperty) {
    if (propertyItem.taskPropertyName != "isOn") return


    const filter = {
        _id: taskID
    }
    const project = {
        _id: 1,
        timeChecks: 1,
    }
    const task: TTask[] = await getDocuments("tasks", filter, project)
    console.log(task[0].timeChecks)

    //turn all off
    for (let index = 0; index < task[0].timeChecks.length; index++) {
        const timedTask = task[0].timeChecks[index];
        stopScheduledTask(timedTask.itemID)
    }

    if (propertyItem.newValue == true) {
        for (let index = 0; index < task[0].timeChecks.length; index++) {
            const timedTask = task[0].timeChecks[index];
            addScheduledTask(timedTask.timingData, timedTask.itemID, () => { taskTimeCheckHandler(taskID, timedTask.itemID) })
        }
    }

    const filter2 = {
        _id: taskID,
    }
    const updateFilter = {
        $set: { isOn: propertyItem.newValue }
    }
    await updateDocument(COLLECTION_TASKS, filter2, updateFilter)
}

async function updateTaskName(taskID: string, propertyItem: TTaskProperty) {
    if (propertyItem.taskPropertyName != "taskName") return

    const updateFilter = {
        $set: { taskName: propertyItem.newValue }
    }

    const filter = { _id: taskID }
    await updateDocument(COLLECTION_TASKS, filter, updateFilter);
}

async function updateIsRepeating(taskID: string, propertyItem: TTaskProperty) {
    if (propertyItem.taskPropertyName != "isRepeating") return

    const updateFilter = {
        $set: { isRepeating: propertyItem.newValue }
    }

    const filter = { _id: taskID }
    await updateDocument(COLLECTION_TASKS, filter, updateFilter);
}


export async function deleteTask(taskID: string) {
    const filter = {
        _id: taskID,
        $expr: {
            $gt: [{ $size: "$timeChecks" }, 0]
        }
    }

    const project = {
        _id: 1,
        timeChecks: 1,
    }


    const tasks: TTask[] = await getDocuments("tasks", filter, project)

    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        for (let j = 0; j < task.timeChecks.length; j++) {
            const timeCheck = task.timeChecks[j];
            stopScheduledTask(timeCheck.itemID)
        }
    }

    const filter2 = {
        _id: taskID
    }

    await deleteDocuments("tasks", filter2);
}

export async function deleteAllProperyChecksOfDevice(deviceID: string) {
    const filter = {}

    const updateFilter = {
        $pull: {
            propertyChecks: { deviceID: deviceID }
        }
    }

    await updateDocuments(COLLECTION_TASKS, filter, updateFilter)
}