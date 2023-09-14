import * as data from '../handlers/file_handler'
import { DeviceListItemType, GeneralDataType, GeneralTaskType, GeneralTopicType } from '../interfaces/generalData.interface';
import { User } from './user';
var GeneralDataInstance: GeneralData;

class GeneralTask implements GeneralTaskType {
    taskId: string

    constructor(taskId: string) {
        this.taskId = taskId;

    }
}
class GeneralTopic implements GeneralTopicType {
    topicName: string
    topicPath: string
    isVisible: boolean

    constructor(topicName: string, topicPath: string, isVisible: boolean) {
        this.topicName = topicName;
        this.topicPath = topicPath
        this.isVisible = isVisible

    }
}


class DeviceListItem implements DeviceListItemType {
    UUID: string
    name: string
    deviceType: Array<number>

    constructor(UUID: string, name: string, deviceType: Array<number>) {
        this.UUID = UUID
        this.name = name
        this.deviceType = deviceType
    }
}


class GeneralData implements GeneralDataType {
    static readonly GENERAL_DATA_FILE_NAME = 'generalData';

    topicList: Array<GeneralTopic>;
    deviceList: Array<DeviceListItem>;
    taskList: Array<GeneralTask>


    private constructor(deviceList: Array<DeviceListItemType>, topics: Array<GeneralTopic>, taskList: Array<GeneralTask>) {
        this.deviceList = deviceList;
        this.topicList = topics;
        this.taskList = taskList;
    }

    getAsJson() {
        let json = {
            "topicList": this.topicList,
            "deviceList": this.deviceList,
            "taskList": this.taskList
        }

        return json
    }

    // TODO: refactor 
    public getAppdataOfUser(user: User) {
        if (user.hasPermission("*")) {
            return this.getAsJson();
        }

        let _deviceJson : DeviceListItem[] = []
        let _taskJson : GeneralTask[] = []

        if (user.hasPermission("device.*") ||
        user.hasPermission("device.*.read") ||
        user.hasPermission("device.*.edit") ||
        user.hasPermission("device.*.delete")) {

        for (let index = 0; index < this.deviceList.length; index++) {
            const device = this.deviceList[index];
            _deviceJson = this.deviceList;
        }
    } else {
        let permissions = user.getPermissions()
        for (let index = 0; index < permissions.length; index++) {
            const permission = permissions[index].name.split(".");
            if (permission[0] == "device") {
                const device_id = permission[1];
                let device = this.getDeviceById(device_id);
                _deviceJson.push(device)
            }
        }
    }

    if (user.hasPermission("task.*") ||
        user.hasPermission("task.*.read") ||
        user.hasPermission("task.*.edit") ||
        user.hasPermission("task.*.delete")) {

        for (let index = 0; index < this.taskList.length; index++) {
            const task = this.taskList[index];
            _taskJson = this.taskList
        }
    }
    else {
        let permissions = user.getPermissions()
        for (let index = 0; index < permissions.length; index++) {
            const permission = permissions[index].name.split(".");
            if (permission[0] == "task") {
                    const task_id = permission[1];
                    let task = this.getTaskById(task_id);
                    _taskJson.push(task)
            }
        }
    }

        let json = {
            "topicList": this.topicList,
            "deviceList": _deviceJson,
            "taskList": _taskJson
        }
        return json
    }

    static async loadFromFile(): Promise<GeneralData> {
        try {
            let generalData = await data.readFile<GeneralDataType>(`${GeneralData.GENERAL_DATA_FILE_NAME}`);
            let _topicList: Array<GeneralTopic> = []
            let _taskList: Array<GeneralTask> = []
            let _deviceList: Array<DeviceListItem> = []

            for (let index = 0; index < generalData.topicList.length; index++) {
                const element = generalData.topicList[index];
                let newTopic = new GeneralTopic(element.topicName, element.topicPath, element.isVisible)
                _topicList.push(newTopic)
            }

            for (let index = 0; index < generalData.taskList.length; index++) {
                const element = generalData.taskList[index];
                let newTTask = new GeneralTask(element.taskId)
                _taskList.push(newTTask)
            }

            for (let index = 0; index < generalData.deviceList.length; index++) {
                const element = generalData.deviceList[index];
                let newDevice = new DeviceListItem(element.UUID, element.name, element.deviceType)
                _deviceList.push(newDevice)
            }

            let generalDataObj = new GeneralData(_deviceList, _topicList, _taskList);
            return generalDataObj
        } catch (err) {
            console.log("File read failed:", err);
            let generalDataObj = new GeneralData([], [], []);
            await generalDataObj.saveData();
            return generalDataObj
        }
    }

    public async saveData() {
        console.log("saveing GeneralData object")
        let dataJson: GeneralDataType = {
            topicList: this.topicList,
            deviceList: this.deviceList,
            taskList: this.taskList
        }

        await data.writeFile<GeneralDataType>(`${GeneralData.GENERAL_DATA_FILE_NAME}`, dataJson)
    }

    public async addTopic(topicName: string, topicPath: string, isVisible: boolean): Promise<void> {
        for (let index = 0; index < this.topicList.length; index++) {
            const element = this.topicList[index];
            if (element.topicName == topicName) {
                throw new Error("topic with same name already exist")
            }

        }
        let newTopic = new GeneralTopic(topicName, topicPath, isVisible)
        this.topicList.push(newTopic)
        await this.saveData();
        console.log("added general topid: '" + topicName + "'")

    }

    public removeTopic(topicName: string): void {
        for (let i = this.topicList.length - 1; i >= 0; i--) {
            const element = this.topicList[i];
            if (topicName == element.topicName) {
                this.topicList.splice(i, 1)
                console.log("removed general topid: '" + topicName + "'")
            }
        }

        this.saveData();
    }

    public async addDevice(UUID: string, deviceName: string, deviceType: Array<number>): Promise<void> {
        let newDeviceGeneralData = new DeviceListItem(UUID, deviceName, deviceType);

        this.deviceList.push(newDeviceGeneralData)
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
        console.log("removed device from general data")
    }

    public getTopicList(): Array<GeneralTopic> {
        return this.topicList;
    }

    public getTaskList(): Array<GeneralTask> {
        return this.taskList;
    }

    getTopicByName(topicName: string) {
        for (let index = 0; index < this.topicList.length; index++) {
            const element = this.topicList[index];
            if (element.topicName == topicName) {
                return element
            }
        }
        throw new Error("general topic not found")
    }

    getDeviceById(deviceID: string) {
        for (let index = 0; index < this.deviceList.length; index++) {
            const element = this.deviceList[index];
            if (element.UUID == deviceID) {
                return element
            }
        }
        throw new Error("general topic not found")
    }

    getTaskById(taskID: string) {
        for (let index = 0; index < this.taskList.length; index++) {
            const element = this.taskList[index];
            if (element.taskId == taskID) {
                return element
            }
        }
        throw new Error("general topic not found")
    }

    public async addTask(taskId: string): Promise<void> {
        let generalTask = new GeneralTask(taskId)

        this.taskList.push(generalTask)
        await this.saveData();
        console.log("added task to general data")
    }

    public async removeTask(taskId: string): Promise<void> {
        for (let i = this.taskList.length - 1; i >= 0; i--) {
            const element = this.taskList[i];
            if (taskId == element.taskId) {
                this.taskList.splice(i, 1)
            }

        }
        await this.saveData();
        console.log("removed task from general data")
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

export { GeneralData, GeneralTopic, DeviceListItem, getGeneralDataInstance, GeneralTask }