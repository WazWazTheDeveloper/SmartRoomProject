import { TimedTask } from "../handlers/timedTask_handler";
import { Device } from "./device";
import data = require('../handlers/file_handler')

interface varCheck {
    deviceId: string
    varName: string
    dataIndex: number;
    checkType: number
    valueToCompareTo: any
    isTrue: boolean
}


class VarCheck implements varCheck {
    public static readonly CHECK_EQUAL_TO: number = 0
    public static readonly CHECK_GREATER_THAN: number = 1
    public static readonly CHECK_LESS_THAN: number = 2

    deviceId: string
    dataIndex: number
    varName: string
    checkType: number
    valueToCompareTo: any
    isTrue: boolean

    constructor(deviceId: string, dataIndex: number, varName: string, checkType: number, valueToCompareTo: any, isTrue: boolean) {
        this.deviceId = deviceId
        this.dataIndex = dataIndex
        this.varName = varName
        this.checkType = checkType
        this.valueToCompareTo = valueToCompareTo
        this.isTrue = isTrue

    }

    getAsJson(): varCheck {
        let newJson: varCheck = {
            "deviceId": this.deviceId,
            "varName": this.varName,
            "dataIndex": this.dataIndex,
            "checkType": this.checkType,
            "valueToCompareTo": this.valueToCompareTo,
            "isTrue": this.isTrue
        }

        return newJson
    }
}

interface timeCheck {
    timingData: string
    isTrue: boolean
}

class TimeCheck implements timeCheck {
    timingData: string
    isTrue: boolean

    constructor(timingData: string, isTrue: boolean) {
        this.timingData = timingData
        this.isTrue = isTrue
    }
}

interface toDoTask {
    deviceId: string
    dataAt: number
    varName: string
    newVarValue: any

}

class ToDoTask implements toDoTask {

    deviceId: string
    dataAt: number
    varName: string
    newVarValue: any
    constructor(deviceId: string, dataIndex: number, varName: string, newVarValue: any) {
        this.deviceId = deviceId;
        this.dataAt = dataIndex;
        this.varName = varName;
        this.newVarValue = newVarValue;
    }

    getAsJson(): toDoTask {
        let dataJson: toDoTask = {
            "deviceId": this.deviceId,
            "dataAt": this.dataAt,
            "varName": this.varName,
            "newVarValue": this.newVarValue
        }

        return dataJson;
    }
}
interface TaskType {
    taskId: string
    taskName: string
    isOn: boolean
    isRepeating: boolean
    varCheckList: Array<VarCheck>
    timedCheckList: Array<TimeCheck>
    toDoTaskList: Array<ToDoTask>
}

class Task implements TaskType {
    // TODO: add is visable property
    private static deviceList: Array<Device> = [];
    taskId: string
    taskName: string
    isOn: boolean
    isRepeating: boolean
    varCheckList: Array<VarCheck>
    timedCheckList: Array<TimeCheck>
    toDoTaskList: Array<ToDoTask>
    timedTasks: Array<TimedTask>
    callbackOnComplate: Function


    constructor(taskId: string, taskName: string, isOn: boolean, isRepeating: boolean, varCheckList: Array<VarCheck>, timedCheckList: Array<TimeCheck>, toDoTaskList: Array<ToDoTask>, callbackOnComplate: Function = () => { }) {
        this.taskId = taskId
        this.taskName = taskName
        this.isOn = isOn
        this.isRepeating = isRepeating
        this.varCheckList = varCheckList
        this.timedCheckList = timedCheckList
        this.toDoTaskList = toDoTaskList
        this.timedTasks = []
        this.callbackOnComplate = callbackOnComplate

        this.onUpdateData = this.onUpdateData.bind(this);
    }
    public static initDeviceList(newDeviceList: Array<Device>): void {
        Task.deviceList = newDeviceList

        console.log("Device list is Task class initialized")
    }

    getAsJson(): TaskType {
        let dataJson: TaskType = {
            "taskId": this.taskId,
            "taskName": this.taskName,
            "isOn": this.isOn,
            "isRepeating": this.isRepeating,
            "varCheckList": this.varCheckList,
            "timedCheckList": this.timedCheckList,
            "toDoTaskList": this.toDoTaskList
        }

        return dataJson;
    }

    async updateData(newData: TaskType) {
        if (newData.taskName != undefined) {
            this.taskName = newData.taskName
        }
        if (newData.isOn != undefined) {
            this.setIsOn(newData.isOn)
        }
        if (newData.isRepeating != undefined) {
            this.isRepeating = newData.isRepeating
        }
        // todo: add more to this

        await this.saveData();
    }

    async saveData(): Promise<void> {
        let dataJson: TaskType = this.getAsJson()

        await data.writeFile<TaskType>(`tasks/${this.taskId}`, dataJson)
        console.log(`done saving Task object ${this.taskId}`)
    }

    public static async loadFromFile(taskId: string): Promise<Task> {
        let deviceDataFromJson = await data.readFile<TaskType>(`tasks/${taskId}`);
        try {
            let newTask = new Task(
                deviceDataFromJson.taskId,
                deviceDataFromJson.taskName,
                deviceDataFromJson.isOn,
                deviceDataFromJson.isRepeating,
                deviceDataFromJson.varCheckList,
                deviceDataFromJson.timedCheckList,
                deviceDataFromJson.toDoTaskList
            )
            newTask.initTimedTasks()
            return newTask
        } catch (err) {
            console.log("File read failed:", err);
            throw new Error(err?.toString());
        }
    }

    public static async createNewTask(taskId: string, taskName: string, isOn: boolean, isRepeating: boolean, varCheckList: Array<VarCheck>, timedCheckList: Array<TimeCheck>, toDoTaskList: Array<ToDoTask>): Promise<Task> {
        let newTask = new Task(taskId, taskName, isOn, isRepeating, varCheckList, timedCheckList, toDoTaskList)

        await newTask.saveData()

        return newTask
    }

    initTimedTasks() {
        this.timedTasks = [];
        for (let index = 0; index < this.timedCheckList.length; index++) {
            const timedCheck = this.timedCheckList[index];
            this.initTimedTask(timedCheck)
        }
    }

    initTimedTask(timedCheck: TimeCheck) {
        let newTimedTask = new TimedTask(timedCheck.timingData, this.onUpdateTimedTask.bind(this, timedCheck))
        this.timedTasks.push(newTimedTask);
        if (this.isOn) {
            newTimedTask.start();
        }
    }

    onUpdateTimedTask(timedCheck: TimeCheck) {
        timedCheck.isTrue = true;
        this.onUpdateData()
    }

    async onUpdateData(): Promise<void> {
        if (!this.isOn) {
            return
        }

        // console.log(this);
        let isAllTrue = true;
        for (let index = 0; index < this.varCheckList.length; index++) {
            const varCheck = this.varCheckList[index];
            switch (varCheck.checkType) {
                case VarCheck.CHECK_EQUAL_TO:
                    isAllTrue = isAllTrue && this.isEqualToCheck(varCheck);
                    break;
                case VarCheck.CHECK_GREATER_THAN:
                    isAllTrue = isAllTrue && this.isGreaterThanCheck(varCheck);
                    break;
                case VarCheck.CHECK_LESS_THAN:
                    isAllTrue = isAllTrue && this.isLessThanCheck(varCheck);
                    break;

                default:
                    throw new Error("unknow check")
                    break;
            }
        }

        for (let index = 0; index < this.timedCheckList.length; index++) {
            const timerCheck = this.timedCheckList[index];
            isAllTrue = isAllTrue && timerCheck.isTrue
        }

        if (isAllTrue) {
            //resetting part
            if (!this.isRepeating) {
                this.isOn = false;
                this.stopAllTimedTasks();
            }

            this.setAllTimerCheck(false);

            // update part 
            for (let index = 0; index < this.toDoTaskList.length; index++) {
                const task = this.toDoTaskList[index];
                console.log(task)
                try{
                    let device = this.getDeviceFromId(task.deviceId);
                    // -1 means for change the device itself
                    if (task.dataAt == -1) {
                        device.setDeviceVar(task.varName, task.newVarValue)
                    } else {
                        device.setVar(task.dataAt, task.varName, task.newVarValue);
                    }
                }
                catch(err) {
                    console.log("task.ts onUpdateData()");
                    console.log(err);
                }
            }

            this.callbackOnComplate();

            console.log("task: '" + this.taskName + "' executed")
        }

        await this.saveData()
    }

    private isEqualToCheck(varCheck: varCheck): boolean {
        let deviceuuid = varCheck.deviceId
        let device = this.getDeviceFromId(deviceuuid)
        if (device.getDeviceData()[varCheck.dataIndex].data.getVar(varCheck.varName) == varCheck.valueToCompareTo) {
            varCheck.isTrue = true
        }
        else {
            varCheck.isTrue = false
        }

        return varCheck.isTrue;
    }

    private isGreaterThanCheck(varCheck: varCheck): boolean {
        let deviceuuid = varCheck.deviceId
        let device = this.getDeviceFromId(deviceuuid)
        if (device.getDeviceData()[varCheck.dataIndex].data.getVar(varCheck.varName) >= varCheck.valueToCompareTo) {
            varCheck.isTrue = true
        }
        else {
            varCheck.isTrue = false
        }

        return varCheck.isTrue;
    }

    private isLessThanCheck(varCheck: varCheck): boolean {
        let deviceuuid = varCheck.deviceId
        let device = this.getDeviceFromId(deviceuuid)
        if (device.getDeviceData()[varCheck.dataIndex].data.getVar(varCheck.varName) <= varCheck.valueToCompareTo) {
            varCheck.isTrue = true
        }
        else {
            varCheck.isTrue = false
        }

        return varCheck.isTrue;
    }

    // HACK: I really dont like how this work
    // probaby want to change this to Appdata.getDeviceById
    getDeviceFromId(uuid: string): Device {
        for (let index = 0; index < Task.deviceList.length; index++) {
            const device = Task.deviceList[index];
            if (device.getUUID() == uuid) {
                return device
            }
        }
        throw new Error("device not found")
    }

    // TODO: add trigger update
    async addVarCheck(deviceId: string, dataIndex: number, varName: string, checkType: number, valueToCompareTo: any): Promise<void> {
        let newVarCheck = new VarCheck(deviceId, dataIndex, varName, checkType, valueToCompareTo, false);
        this.varCheckList.push(newVarCheck);
        await this.saveData()
        this.onUpdateData()
    }

    async removeVarCheck(indexOfVarCheck: number): Promise<void> {
        this.varCheckList.splice(indexOfVarCheck, 1);
        await this.saveData()
        this.onUpdateData()
    }

    async addTodoTask(deviceId: string, dataIndex: number, varName: string, newVarValue: any): Promise<void> {
        let newTodoTask = new ToDoTask(deviceId, dataIndex, varName, newVarValue);
        this.toDoTaskList.push(newTodoTask);
        await this.saveData()
        this.onUpdateData()
    }

    async removeTodoTask(indexOfTodoTask: number): Promise<void> {
        this.toDoTaskList.splice(indexOfTodoTask, 1);
        await this.saveData()
        this.onUpdateData();
    }

    async emptyTodoTask(): Promise<void> {
        this.toDoTaskList.splice(0, this.toDoTaskList.length);
        await this.saveData()
        this.onUpdateData()
    }

    async addTimedCheck(timingData: string): Promise<void> {
        let newTimedCheck = new TimeCheck(timingData, false);
        this.timedCheckList.push(newTimedCheck);
        this.initTimedTask(newTimedCheck);
        await this.saveData()
        // this.onUpdateData()
    }

    async removeTimedCheck(indexOfTimedCheck: number): Promise<void> {
        this.timedCheckList.splice(indexOfTimedCheck, 1);
        this.timedTasks[indexOfTimedCheck].stop();
        this.timedTasks.splice(indexOfTimedCheck, 1);
        await this.saveData()
        // this.onUpdateData()
    }

    setCallbackOnComplate(callback: Function): void {
        this.callbackOnComplate = callback;
    }
    removeCallbackOnComplate(callback: Function): void {
        this.callbackOnComplate = () => { };
    }

    async setIsOn(isOn: boolean) {
        this.isOn = isOn;
        this.setAllTimerCheck(false)
        if (this.isOn) {
            this.startAllTimedTasks();
        }
        else {
            this.stopAllTimedTasks();
        }

        await this.saveData();

        this.onUpdateData();
    }

    setAllTimerCheck(isTrue: boolean) {
        for (let index = 0; index < this.timedCheckList.length; index++) {
            const timerCheck = this.timedCheckList[index];
            const timedTask = this.timedTasks[index];
            timerCheck.isTrue = isTrue;
        }
    }

    stopAllTimedTasks() {
        for (let index = 0; index < this.timedCheckList.length; index++) {
            const timerCheck = this.timedCheckList[index];
            const timedTask = this.timedTasks[index];

            timedTask.stop()
        }
    }

    startAllTimedTasks() {
        for (let index = 0; index < this.timedCheckList.length; index++) {
            const timerCheck = this.timedCheckList[index];
            const timedTask = this.timedTasks[index];

            timedTask.start()
        }
    }
}

export { Task , TaskType }