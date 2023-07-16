import { DataPackage } from "./devices/typeClasses/DataPackage"
import { GeneralTopic } from "./devices/typeClasses/generalData"
import { TopicData } from "./devices/typeClasses/topicData"
import { device, eventFunctionData } from "./devices/types"
import data = require('./utility/file_handler')

interface varCheck {
    deviceId: string
    varName: string
    checkType: number //such and > < == and stuff
    valueToCompareTo: any
}


class VarCheck implements varCheck {
    public static readonly CHECK_EQUAL_TO: number = 0
    public static readonly CHECK_GREATER_THAN: number = 1
    public static readonly CHECK_LESS_THAN: number = 2

    deviceId: string
    varName: string
    checkType: number
    valueToCompareTo: any

    constructor(deviceId: string, varName: string, checkType: number, valueToCompareTo: any) {
        this.deviceId = deviceId
        this.varName = varName
        this.checkType = checkType
        this.valueToCompareTo = valueToCompareTo

    }

    getAsJson(): varCheck {
        let newJson: varCheck = {
            "deviceId": this.deviceId,
            "varName": this.varName,
            "checkType": this.checkType,
            "valueToCompareTo": this.valueToCompareTo
        }

        return newJson
    }
}

interface task {
    taskId: string
    taskName: string
    taskType: string
    isOn: boolean
    isRepeating: boolean
    varCheck: Array<VarCheck>

    // TODO: decide what it does
    // todo:Function 
}

class Task implements task {
    private static deviceList:Array<device> = [];
    taskId: string
    taskName: string
    taskType: string
    isOn: boolean
    isRepeating: boolean
    varCheck: Array<VarCheck>

    constructor(taskId: string, taskName: string, taskType: string, isOn: boolean, isRepeating: boolean, varCheck: Array<VarCheck>) {
        this.taskId = taskId
        this.taskName = taskName
        this.taskType = taskType
        this.isOn = isOn
        this.isRepeating = isRepeating
        this.varCheck = varCheck
    }

    public static initDeviceList(newDeviceList:Array<device>):void {
        Task.deviceList = newDeviceList
    }

    getAsJson(): task {
        let dataJson: task = {
            "taskId": this.taskId,
            "taskName": this.taskName,
            "taskType": this.taskType,
            "isOn": this.isOn,
            "isRepeating": this.isRepeating,
            "varCheck": this.varCheck
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
                deviceDataFromJson.varCheck
            )
            return newTask
        } catch (err) {
            console.log("File read failed:", err);
            throw new Error(err?.toString());
        }
    }

    //FIXME this defenatly doent work and need to be fixed
    async onUpdateData(): Promise<void> {
        console.log("atleast this work")
    }

    //FIXME
    checkEqualTo(): boolean {
        return false
    }


}

export { Task }