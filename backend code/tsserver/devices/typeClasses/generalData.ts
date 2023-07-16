import { deviceListItem, generalData, generalTask, generalTopic } from "../types";
import * as data from '../../utility/file_handler'
import { log } from "console";
var GeneralDataInstance: GeneralData;

class GeneralTask implements generalTask {
    taskId: string

    constructor(taskId: string) {
        this.taskId = taskId;

    }
}
class GeneralTopic implements generalTopic {
    topicName: string
    topicPath: string

    constructor(topicName: string, topicPath: string) {
        this.topicName = topicName;
        this.topicPath = topicPath

    }
}


class DeviceListItem implements deviceListItem {
    UUID: string //this should be private as you dont want use user to be able to change the UUID (i think?)
    name: string
    deviceType: Array<string>

    constructor(UUID: string, name: string, deviceType: Array<string>) {
        this.UUID = UUID
        this.name = name
        this.deviceType = deviceType
    }
}


class GeneralData implements generalData {
    static readonly GENERAL_DATA_FILE_NAME = 'generalData';

    topicList: Array<GeneralTopic>;
    deviceList: Array<DeviceListItem>;
    taskList: Array<generalTask>

    constructor(deviceList: Array<deviceListItem>, topics: Array<GeneralTopic>, taskList: Array<generalTask>) {
        this.deviceList = deviceList;
        this.topicList = topics;
        this.taskList = taskList;
    }

    static async loadFromFile(): Promise<GeneralData> {
        let generalData = await data.readFile<generalData>(`${GeneralData.GENERAL_DATA_FILE_NAME}`);

        try {
            let _topicList: Array<GeneralTopic> = []
            let _taskList: Array<generalTask> = []
            for (let index = 0; index < generalData.topicList.length; index++) {
                const element = generalData.topicList[index];
                let newTopic = new GeneralTopic(element.topicName, element.topicPath)
                _topicList.push(newTopic)
            }

            for (let index = 0; index < generalData.taskList.length; index++) {
                const element = generalData.taskList[index];
                let newTTask = new GeneralTask(element.taskId)
                _taskList.push(newTTask)
            }
            let generalDataObj = new GeneralData(generalData.deviceList, _topicList, _taskList);
            return generalDataObj
        } catch (err) {
            console.log("File read failed:", err);
            let generalDataObj = new GeneralData([], [], []);
            generalDataObj.saveData();
            return generalDataObj
        }
    }

    public async saveData() {
        console.log("saveing GeneralData object")
        let dataJson: generalData = {
            topicList: this.topicList,
            deviceList: this.deviceList,
            taskList: this.taskList
        }

        await data.writeFile<generalData>(`${GeneralData.GENERAL_DATA_FILE_NAME}`, dataJson)
    }

    public async addTopic(topicName: string, topicPath: string) {
        for (let index = 0; index < this.topicList.length; index++) {
            const element = this.topicList[index];
            if (element.topicName == topicName) {
                throw new Error("topic with same name already exist")
            }

        }
        let newTopic = new GeneralTopic(topicName, topicPath)
        this.topicList.push(newTopic)
        await this.saveData();

    }

    public removeTopic(topicName: string) {
        for (let i = this.topicList.length - 1; i >= 0; i--) {
            const element = this.topicList[i];
            if (topicName == element.topicName) {
                this.topicList.splice(i, 1)
                log("removed general topid: '" + topicName + "'")
            }
        }

        this.saveData();
    }

    public async addDevice(newDevice: DeviceListItem): Promise<void> {
        this.deviceList.push(newDevice)
        await this.saveData();

        console.log("new device added to general data")
    }

    public async removeDevice(uuid: string): Promise<void> {
        for (let i = this.deviceList.length - 1; i >= 0; i--) {
            const element = this.deviceList[i];
            if (uuid == element.UUID) {
                this.deviceList.splice(i, 1)
            }

        }
        await this.saveData();
        console.log("new device added to general data")
    }

    public getTopicList() {
        return this.topicList;
    }

    public getTaskList() {
        return this.taskList;
    }

    public async addTask(generalTask : GeneralTask) {
        this.taskList.push(generalTask)
        await this.saveData();
    }
    // IMPLEMENT
    public async removeTask() {

    }

    public getDeviceList() {
        return this.deviceList;
    }
}

async function getGeneralDataInstance(): Promise<GeneralData> {
    if (!GeneralDataInstance) {
        let data = await GeneralData.loadFromFile()
        GeneralDataInstance = data;
        return GeneralDataInstance;
    } else {
        return GeneralDataInstance;
    }
}

export { GeneralData, GeneralTopic, DeviceListItem, getGeneralDataInstance ,GeneralTask}