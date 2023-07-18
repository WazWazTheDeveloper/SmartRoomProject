import { Device } from "./devices/typeClasses/device"
import data = require('./utility/file_handler')
import { TimedTask } from "./utility/timedTask"

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
    dataIndex: number
    varName: string
    newVarValue: any

}

class ToDoTask implements toDoTask {

    deviceId: string
    dataIndex: number
    varName: string
    newVarValue: any
    constructor(deviceId: string, dataIndex: number, varName: string, newVarValue: any) {
        this.deviceId = deviceId;
        this.dataIndex = dataIndex;
        this.varName = varName;
        this.newVarValue = newVarValue;
    }

    getAsJson(): toDoTask {
        let dataJson: toDoTask = {
            "deviceId": this.deviceId,
            "dataIndex": this.dataIndex,
            "varName": this.varName,
            "newVarValue": this.newVarValue
        }

        return dataJson;
    }
}

interface task {
    taskId: string
    taskName: string
    isOn: boolean
    isRepeating: boolean
    varCheckList: Array<VarCheck>
    timedCheckList: Array<TimeCheck>
    toDoTaskList: Array<ToDoTask>
}

class Task implements task {
    private static deviceList: Array<Device> = [];
    taskId: string
    taskName: string
    isOn: boolean
    isRepeating: boolean
    varCheckList: Array<VarCheck>
    timedCheckList: Array<TimeCheck>
    toDoTaskList: Array<ToDoTask>

    timedTasks: Array<TimedTask>

    // HACK: this is hacked in and need to looked into later
    callbackOnComplate: Array<Function>

    constructor(taskId: string, taskName: string, isOn: boolean, isRepeating: boolean, varCheckList: Array<VarCheck>, timedCheckList: Array<TimeCheck>, toDoTaskList: Array<ToDoTask>,callbackOnComplate=[]) {
        this.taskId = taskId
        this.taskName = taskName
        this.isOn = isOn
        this.isRepeating = isRepeating
        this.varCheckList = varCheckList
        this.timedCheckList = timedCheckList
        this.toDoTaskList = toDoTaskList
        this.timedTasks = []
        this.callbackOnComplate = callbackOnComplate
    }

    public static initDeviceList(newDeviceList: Array<Device>): void {
        Task.deviceList = newDeviceList

        console.log("Device list is Task class initialized")
    }

    getAsJson(): task {
        let dataJson: task = {
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

    async saveData(): Promise<void> {
        let dataJson: task = this.getAsJson()

        await data.writeFile<task>(`tasks/${this.taskId}`, dataJson)
        console.log(`done saving Task object ${this.taskId}`)
    }

    public static async loadFromFile(taskId: string): Promise<Task> {
        let deviceDataFromJson = await data.readFile<task>(`tasks/${taskId}`);
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
        if(this.isOn) {
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
            // update part 
            for (let index = 0; index < this.toDoTaskList.length; index++) {
                const task = this.toDoTaskList[index];
                let device = this.getDeviceFromId(task.deviceId);
                // -1 means for change the device itself
                if(task.dataIndex == -1){
                    device.setVar(task.varName,task.newVarValue)
                }else {
                    device.setDataVar(task.dataIndex, task.varName, task.newVarValue, false);
                }
            }

            console.log("")
            for (let index = 0; index < this.callbackOnComplate.length; index++) {
                const _callback = this.callbackOnComplate[index];
                _callback();
                
            }

            //resetting part
            if (!this.isRepeating) {
                this.isOn = false;
                this.stopAllTimedTasks();
            }

            this.setAllTimerCheck(false);

            console.log("task: '"+this.taskName+"' executed")
        }

        await this.saveData()
    }

    private isEqualToCheck(varCheck: varCheck): boolean {
        let deviceuuid = varCheck.deviceId
        let device = this.getDeviceFromId(deviceuuid)
        if (device.deviceData[varCheck.dataIndex].getVar(varCheck.varName) == varCheck.valueToCompareTo) {
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
        if (device.deviceData[varCheck.dataIndex].getVar(varCheck.varName) >= varCheck.valueToCompareTo) {
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
        if (device.deviceData[varCheck.dataIndex].getVar(varCheck.varName) <= varCheck.valueToCompareTo) {
            varCheck.isTrue = true
        }
        else {
            varCheck.isTrue = false
        }

        return varCheck.isTrue;
    }

    // HACK: I really dont like how this word
    getDeviceFromId(uuid: string): Device {
        for (let index = 0; index < Task.deviceList.length; index++) {
            const device = Task.deviceList[index];
            if (device.uuid == uuid) {
                return device;
            }
        }
        throw new Error("device not found")
    }

    async addVarCheck(deviceId: string, dataIndex: number, varName: string, checkType: number, valueToCompareTo: any): Promise<void> {
        let newVarCheck = new VarCheck(deviceId, dataIndex, varName, checkType, valueToCompareTo, false);
        this.varCheckList.push(newVarCheck);
        await this.saveData()
        this.onUpdateData()
    }

    async removeVarCheck(indexOfVarCheck: number): Promise<void> {
        this.varCheckList.slice(indexOfVarCheck, 1);
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
        this.toDoTaskList.slice(indexOfTodoTask, 1);
        await this.saveData()
        this.onUpdateData()
    }

    async emptyTodoTask(): Promise<void> {
        console.log("imhere")
        this.toDoTaskList.splice(0,this.toDoTaskList.length);
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
        this.timedCheckList.slice(indexOfTimedCheck, 1);
        this.timedTasks[indexOfTimedCheck].stop();
        this.timedTasks.slice(indexOfTimedCheck, 1);
        await this.saveData()
        // this.onUpdateData()
    }

    // HACK: this is hacked in and need to looked into later
    addCallbackOnComplate(callback : Function):void  {
        this.callbackOnComplate.push(callback)
    }
    // HACK: this is hacked in and need to looked into later
    removeCallbackOnComplate(callback : Function):void {
        for (let index = 0; index < this.callbackOnComplate.length; index++) {
            const _function = this.callbackOnComplate[index];
            if(_function == callback) {
                this.callbackOnComplate.splice(index, 1)
            }
        }
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
    }

    setAllTimerCheck(isTrue : boolean) {
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

export { Task, VarCheck, ToDoTask }