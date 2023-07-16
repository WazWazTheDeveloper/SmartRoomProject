import { DataPackage } from "./devices/typeClasses/DataPackage"
import { Device } from "./devices/typeClasses/device"
import { GeneralTopic } from "./devices/typeClasses/generalData"
import { TopicData } from "./devices/typeClasses/topicData"
import { device, eventFunctionData } from "./devices/types"
import data = require('./utility/file_handler')

interface varCheck {
    deviceId: string
    varName: string
    dataIndex: number;
    checkType: number //such and > < == and stuff
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

interface toDoTask {
    deviceId:string
    dataIndex: number
    varName:string
    newVarValue:any
    
}

class ToDoTask implements toDoTask {

    deviceId:string
    dataIndex: number
    varName:string
    newVarValue:any
    constructor (deviceId:string , dataIndex: number,varName:string,newVarValue:any) {
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
    taskType: string
    isOn: boolean
    isRepeating: boolean
    varCheckList: Array<VarCheck>
    toDoTaskList: Array<ToDoTask>
}

class Task implements task {
    private static deviceList: Array<Device> = [];
    taskId: string
    taskName: string
    taskType: string
    isOn: boolean
    isRepeating: boolean
    varCheckList: Array<VarCheck>
    toDoTaskList: Array<ToDoTask>

    constructor(taskId: string, taskName: string, taskType: string, isOn: boolean, isRepeating: boolean, varCheckList: Array<VarCheck>,toDoTaskList: Array<ToDoTask>) {
        this.taskId = taskId
        this.taskName = taskName
        this.taskType = taskType
        this.isOn = isOn
        this.isRepeating = isRepeating
        this.varCheckList = varCheckList
        this.toDoTaskList = toDoTaskList
    }

    public static initDeviceList(newDeviceList: Array<Device>): void {
        Task.deviceList = newDeviceList
    }

    getAsJson(): task {
        let dataJson: task = {
            "taskId": this.taskId,
            "taskName": this.taskName,
            "taskType": this.taskType,
            "isOn": this.isOn,
            "isRepeating": this.isRepeating,
            "varCheckList": this.varCheckList,
            "toDoTaskList": this.toDoTaskList
        }

        return dataJson;
    }

    async saveData(): Promise<void> {
        let dataJson: task = this.getAsJson()

        await data.writeFile<task>(`tasks/${this.taskId}`, dataJson)
        console.log(`done saving Device object ${this.taskId}`)
    }

    public static async loadFromFile(taskId: string): Promise<Task> {
        let deviceDataFromJson = await data.readFile<task>(`tasks/${taskId}`);
        try {
            let newTask = new Task(
                deviceDataFromJson.taskId,
                deviceDataFromJson.taskName,
                deviceDataFromJson.taskType,
                deviceDataFromJson.isOn,
                deviceDataFromJson.isRepeating,
                deviceDataFromJson.varCheckList,
                deviceDataFromJson.toDoTaskList
            )
            return newTask
        } catch (err) {
            console.log("File read failed:", err);
            throw new Error(err?.toString());
        }
    }

    public static async createNewTask(taskId: string, taskName: string, taskType: string, isOn: boolean, isRepeating: boolean, varCheckList: Array<VarCheck>,toDoTaskList: Array<ToDoTask>):Promise<Task>{
        let newTask = new Task(taskId, taskName, taskType, isOn, isRepeating, varCheckList,toDoTaskList)

        await newTask.saveData()

        return newTask
    }

    async onUpdateData(): Promise<void> {
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

        if (isAllTrue) {
            for (let index = 0; index < this.toDoTaskList.length; index++) {
                const task = this.toDoTaskList[index];
                let device = this.getDeviceFromId(task.deviceId);
                device.setVar(task.dataIndex,task.varName,task.newVarValue,false);
            }
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

    async addTodoTask(deviceId:string , dataIndex: number,varName:string,newVarValue:any): Promise<void> {
        let newTodoTask = new ToDoTask(deviceId, dataIndex, varName, newVarValue);
        this.toDoTaskList.push(newTodoTask);
        await this.saveData()
    }

    async removeTodoTask(indexOfTodoTask: number): Promise<void> {
        this.toDoTaskList.slice(indexOfTodoTask, 1);
        await this.saveData()
        this.onUpdateData()
    }

}

export { Task, VarCheck,ToDoTask }