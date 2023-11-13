import * as data from '../handlers/file_handler'
import { DeviceListItemType, GeneralDataType, GeneralPermissionGroupType, GeneralTaskType, GeneralTopicType } from '../interfaces/generalData.interface';
import { PermissionGroup } from './permissionGroup';
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

class GeneralPermissionGroup implements GeneralPermissionGroupType {
    groupId: string
    groupName: string

    constructor(groupId: string, groupName: string) {
        this.groupId = groupId
        this.groupName = groupName
    }
}


class GeneralData implements GeneralDataType {
    static readonly GENERAL_DATA_FILE_NAME = 'generalData';

    topicList: Array<GeneralTopic>;
    deviceList: Array<DeviceListItem>;
    taskList: Array<GeneralTask>;
    usernameList: Array<string>;
    permissionGroup: Array<GeneralPermissionGroup>;


    private constructor(
        deviceList: Array<DeviceListItemType>,
        topics: Array<GeneralTopic>,
        taskList: Array<GeneralTask>,
        usernameList: Array<string>,
        permissionGroup: Array<GeneralPermissionGroup>
    ) {
        this.deviceList = deviceList;
        this.topicList = topics;
        this.taskList = taskList;
        this.usernameList = usernameList;
        this.permissionGroup = permissionGroup;
    }

    getAsJson() {
        let json = {
            "topicList": this.topicList,
            "deviceList": this.deviceList,
            "taskList": this.taskList,
            "usernameList": this.usernameList,
            "permissionGroup": this.permissionGroup
        }

        return json
    }

    // TODO: refactor
    public async getAppdataOfUser(user: User) {
        if (await user.hasPermission("*")) {
            return this.getAsJson();
        }

        let _deviceJson: DeviceListItem[] = []
        let _taskJson: GeneralTask[] = []

        if (await user.hasPermission("device.*") ||
            await user.hasPermission("device.*.read") ||
            await user.hasPermission("device.*.edit") ||
            await user.hasPermission("device.*.delete")) {

            for (let index = 0; index < this.deviceList.length; index++) {
                const device = this.deviceList[index];
                _deviceJson = this.deviceList;
            }
        } else {
            let permissions = user.getPermissions()
            for (let index = 0; index < permissions.length; index++) {
                const permission = permissions[index].split(".");
                if (permission[0] == "device") {
                    const device_id = permission[1];
                    let device = this.getDeviceById(device_id);
                    _deviceJson.push(device)
                }
            }
        }

        if (await user.hasPermission("task.*") ||
            await user.hasPermission("task.*.read") ||
            await user.hasPermission("task.*.edit") ||
            await user.hasPermission("task.*.delete")) {

            for (let index = 0; index < this.taskList.length; index++) {
                const task = this.taskList[index];
                _taskJson = this.taskList
            }
        }
        else {
            let permissions = user.getPermissions()
            for (let index = 0; index < permissions.length; index++) {
                const permission = permissions[index].split(".");
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
            let _userIdList: Array<string> = []
            let _permissionGroupList: Array<GeneralPermissionGroup> = []

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

            for (let index = 0; index < generalData.usernameList.length; index++) {
                const newUser = generalData.usernameList[index];
                _userIdList.push(newUser)
            }

            for (let index = 0; index < generalData.permissionGroup.length; index++) {
                const element = generalData.permissionGroup[index];
                let newTopic = new GeneralPermissionGroup(element.groupId, element.groupName)
                _permissionGroupList.push(newTopic)
            }


            let generalDataObj = new GeneralData(_deviceList, _topicList, _taskList, _userIdList,_permissionGroupList);
            return generalDataObj
        } catch (err) {
            console.log("File read failed:", err);
            let generalDataObj = new GeneralData([], [], [], [],[]);
            await generalDataObj.saveData();
            return generalDataObj
        }
    }

    public async saveData() {
        console.log("saveing GeneralData object")
        let dataJson: GeneralDataType = {
            topicList: this.topicList,
            deviceList: this.deviceList,
            taskList: this.taskList,
            usernameList: this.usernameList,
            permissionGroup: this.permissionGroup
        }

        await data.writeFile<GeneralDataType>(`${GeneralData.GENERAL_DATA_FILE_NAME}`, dataJson)
    }

    public async addUser(username: string) {
        for (let index = 0; index < this.usernameList.length; index++) {
            const element = this.usernameList[index];
            if (element == username) {
                throw new Error("user with same name already exist")
            }

        }

        this.usernameList.push(username);
        await this.saveData();
        console.log("added general user: '" + username + "'")
    }

    public async removeUser(username: string) {
        for (let i = this.usernameList.length - 1; i >= 0; i--) {
            const element = this.usernameList[i];
            if (username == element) {
                this.usernameList.splice(i, 1)
                console.log("removed general user: '" + username + "'")
            }
        }

        await this.saveData();
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

    public async addPermissionGroup(groupId: string, groupName: string): Promise<void> {
        let newGroup = new GeneralPermissionGroup(groupId, groupName);

        this.permissionGroup.push(newGroup)
        
        await this.saveData();

        console.log("new permissionGroup added to general data")
    }

    public async removePermissionGroup(groupId: string): Promise<void> {
        for (let i = this.permissionGroup.length - 1; i >= 0; i--) {
            const element = this.permissionGroup[i];
            if (groupId == element.groupId) {
                this.permissionGroup.splice(i, 1)
            }

        }
        await this.saveData();
        console.log("removed permissionGroup from general data")
    }

    public getTopicList(): Array<GeneralTopic> {
        return this.topicList;
    }

    public getTaskList(): Array<GeneralTask> {
        return this.taskList;
    }

    public getUsernameList(): Array<string> {
        return this.usernameList;
    }

    public getPermissionGroupList(): Array<GeneralPermissionGroup> {
        return this.permissionGroup;
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