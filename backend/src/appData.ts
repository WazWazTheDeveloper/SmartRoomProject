import { Device } from "./models/device";
import { GeneralData, getGeneralDataInstance } from "./models/generalData";
import { Task } from "./models/task";
import { WebSocketServerHandler } from "./handlers/webSocketServerHandler";
import { removeFile } from "./handlers/file_handler";
import { AppdataEvent } from "./interfaces/appData.interface";
import { User } from "./models/user";
import { DataPacket } from "./models/dataPacket";
import { Console } from "console";
import { PermissionGroup } from "./models/permissionGroup";

var appDataInstance: AppData;

interface callback {
    event: string
    callback: Function
}


class AppData {
    public static readonly ON_DEVICE_TOPIC_CHANGE = "deviceTopicChange";
    public static readonly ON_DEVICE_DATA_CHANGE = "deviceDataChange";
    public static readonly ON_DEVICE_REMOVED = "deviceRemoved";
    public static readonly ON_DEVICE_ADDED = "deviceAdded";

    public static readonly ON_DATA_CHANGE = "dataChange";
    
    public static readonly ON_TASK_CHANGE = "taskChange"
    public static readonly ON_TASK_COMPLETE = "taskComplete"
    public static readonly ON_TASK_CREATED = "taskCreated";
    public static readonly ON_TASK_DELETED = "taskDeleted";

    public static readonly ON_ANY_CHANGE = "any";

    private generalData: GeneralData;
    private deviceList: Array<Device>;
    private taskList: Array<Task>
    private callbacks: Array<callback>

    private constructor(generalData: GeneralData, devices: Array<Device>, taskList: Array<Task>) {
        this.generalData = generalData;
        this.deviceList = devices;
        this.taskList = taskList;
        this.callbacks = [];

        this.updateDevice = this.updateDevice.bind(this);
        this.triggerCallbacks = this.triggerCallbacks.bind(this);
    }

    public getAsJson() {
        let taskJson = []
        for (let index = 0; index < this.taskList.length; index++) {
            const task = this.taskList[index];
            taskJson.push(task.getAsJson())
        }

        let deviceJson = []
        for (let index = 0; index < this.deviceList.length; index++) {
            const device = this.deviceList[index];
            deviceJson.push(device.getAsJson())
        }
        let json = {
            "taskList": taskJson,
            "generalData": this.generalData.getAsJson(),
            "deviceList": deviceJson
        }

        return json
    }

    // TODO: declusterfuck this
    public async getAppdataOfUser(user: User) {
        let taskJson = []
        let deviceJson = []
        let userJson = []
        let permissionGroups = []

        if (user.getIsAdmin()) {
            let generalUserList = this.generalData.getUsernameList();
            for (let index = 0; index < generalUserList.length; index++) {
                const generalUser = generalUserList[index];
                let user = await (await User.getUser(generalUser)).getAsJson();
                userJson.push(user)
            }
            let generalPermissionGroupsList = this.generalData.getPermissionGroupList();
            for (let index = 0; index < generalPermissionGroupsList.length; index++) {
                const generalPermissionGroups = generalPermissionGroupsList[index];
                let user = await (await PermissionGroup.getPermissionGroup(generalPermissionGroups.groupId)).getAsJson();
                permissionGroups.push(user)
            }
        }

        if (await user.hasPermission("*")) {
            let json = this.getAsJson();
            return Object.assign({}, json, { "userList": userJson, "permissionGroups" : permissionGroups} )
        }

        console.log(user.getPermissions())

        if (await user.hasPermission("device.*") ||
            await user.hasPermission("device.*.read") ||
            await user.hasPermission("device.*.edit") ||
            await user.hasPermission("device.*.delete")) {

            for (let index = 0; index < this.deviceList.length; index++) {
                const device = this.deviceList[index];
                deviceJson.push(device.getAsJson())
            }
        } else {
            let permissions = user.getPermissions()
            for (let index = 0; index < permissions.length; index++) {
                const permission = permissions[index].split(".");
                if (permission[0] == "device") {
                    const device_id = permission[1];
                    try {
                        let device = this.getDeviceById(device_id);
                        deviceJson.push(device.getAsJson())
                    }
                    catch (err) {
                        throw new Error("device dosen't exist")
                    }
                }
            }
        }

        if (await user.hasPermission("task.*") ||
            await user.hasPermission("task.*.read") ||
            await user.hasPermission("task.*.edit") ||
            await user.hasPermission("task.*.delete")) {

            for (let index = 0; index < this.taskList.length; index++) {
                const task = this.taskList[index];
                taskJson.push(task.getAsJson())
            }
        }
        else {
            let permissions = user.getPermissions()
            for (let index = 0; index < permissions.length; index++) {
                const permission = permissions[index].split(".");
                if (permission[0] == "task") {
                    const task_id = permission[1];
                    let task = this.getTaskById(task_id);
                    // TODO: add check if task.isVisable() after inplementing isVisable
                    taskJson.push(task.getAsJson())
                }
            }
        }

        let json = {
            "taskList": taskJson,
            "generalData": this.generalData.getAppdataOfUser(user),
            "deviceList": deviceJson,
            "userList": userJson,
            "permissionGroups" : permissionGroups
        }

        return json;
    }

    public static async init(): Promise<void> {
        if (!appDataInstance) {
            let generalData = await getGeneralDataInstance();
            let devices = await AppData.readDeviceListFromFiles(generalData);
            let tasks = await AppData.readTaskListFromFiles(generalData);
            let newAppDataInstance = new AppData(generalData, devices, tasks);

            for (let index = 0; index < newAppDataInstance.getDeviceList().length; index++) {
                const device = newAppDataInstance.getDeviceList()[index];
                device.setCallbackOnChange(newAppDataInstance.triggerCallbacks)
            }

            for (let index = 0; index < newAppDataInstance.getTaskList().length; index++) {
                const task = newAppDataInstance.getTaskList()[index];
                task.setCallbackOnChange(newAppDataInstance.triggerCallbacks)
            }

            appDataInstance = newAppDataInstance;
            Task.initDeviceList(devices);

            for (let index = 0; index < tasks.length; index++) {
                const task = tasks[index];
                appDataInstance.on(this.ON_DATA_CHANGE, task.onUpdateData.bind(task));
            }

            //create admin account if doesn't already exist
            let isAdminExist = false;
            for (let index = 0; index < newAppDataInstance.getGeneralData().getUsernameList().length; index++) {
                const user = newAppDataInstance.getGeneralData().getUsernameList()[index];
                if (user == "Admin") {
                    isAdminExist  = true
                }
            }
            if(!isAdminExist) {
                let adminUser: User = await User.createNewUser('Admin', 'admin',true,['*']);
            }
        }
    }

    private static async readTaskListFromFiles(generalData: GeneralData): Promise<Array<Task>> {
        let taskList = generalData.getTaskList();
        let newTaskList: Array<Task> = [];
        for (let i = 0; i < taskList.length; i++) {
            const task = taskList[i];
            let newTask: Task = await Task.loadFromFile(task.taskId)
            newTaskList.push(newTask);
        }

        return newTaskList
    }

    public static async getAppDataInstance(): Promise<AppData> {
        if (!appDataInstance) {
            await AppData.init();

            return appDataInstance;
        }
        else {
            return appDataInstance;
        }
    }

    private static async readDeviceListFromFiles(generalData: GeneralData): Promise<Array<Device>> {
        let deviceList = generalData.getDeviceList();
        let newDeviceList: Array<Device> = [];
        for (let i = 0; i < deviceList.length; i++) {
            const device = deviceList[i];
            let newDevice = await Device.loadFromFile(device.UUID, device.deviceType, generalData)
            newDeviceList.push(newDevice);
        }

        return newDeviceList
    }

    public getGeneralData(): GeneralData {
        return this.generalData;
    }

    public getTaskList(): Array<Task> {
        return this.taskList;
    }

    public getDeviceList(): Array<Device> {
        return this.deviceList;
    }

    public async addUser(UUID: string) {
        await this.generalData.addUser(UUID);
    }

    public async removeUser(UUID: string) {
        await this.generalData.removeUser(UUID);
    }

    public async addPermissionGroup(groupId: string, groupName: string) {
        await this.generalData.addPermissionGroup(groupId, groupName)
    }

    public async removePermissionGroup(groupId: string) {
        await this.generalData.removePermissionGroup(groupId)
    }

    //TODO: change to createDevice
    public async createNewDevice(deviceName: string, uuid: string, deviceType: Array<number>, topic: string): Promise<void> {
        if (Array.isArray(deviceType) && deviceType.length == 0) {
            throw new Error("deviceTypeList should not be empty");
        }

        for (let i = 0; i < this.generalData.getDeviceList().length; i++) {
            const element = this.generalData.getDeviceList()[i];
            if (element.UUID == uuid) {
                throw new Error("UUID is taken");
            }
        }

        this.addGeneralTopic(`${uuid}`, `device/${uuid}`, true);
        let deviceGeneralTopic = this.generalData.getTopicByName(uuid);

        let newDevice: Device = await Device.createNewDevice(deviceName, uuid, deviceType, deviceGeneralTopic, this.triggerCallbacks);

        this.deviceList.push(newDevice);
        this.generalData.addDevice(uuid, deviceName, deviceType);
        console.log(`Created new device ${uuid}`)


        let eventData: AppdataEvent = {
            targetId: newDevice.getUUID(),
            event: AppData.ON_DEVICE_ADDED,
            dataType: -1,
            dataAt: -1,
            oldTopic: "",
        }

        this.triggerCallbacks(eventData)
    }

    async removeDevice(uuid: string): Promise<void> {
        const _device = this.getDeviceById(uuid)
        await this.generalData.removeDevice(uuid);
        await this.generalData.removeTopic(_device.getTopicPath());

        let topic: string = ""
        try {
            topic = this.getDeviceById(uuid).getTopicPath();
        } catch (err) {
            console.log("topic doesnt exist")
        }

        for (let i = this.deviceList.length - 1; i >= 0; i--) {
            const element = this.deviceList[i];
            if (uuid == element.getUUID()) {
                this.deviceList.splice(i, 1)
            }
        }
        this.removeDevicePermissionsOfDevice(uuid);

        removeFile(`devices/${uuid}`)
        console.log(`Removed device ${uuid} from appData`)

        let eventData: AppdataEvent = {
            targetId: uuid,
            event: AppData.ON_DEVICE_REMOVED,
            dataType: -1,
            dataAt: -1,
            oldTopic: topic,
        }

        
        this.triggerCallbacks(eventData)
    }

    async removeDevicePermissionsOfDevice(uuid: string) {
        let usernamesList = this.generalData.getUsernameList();

        for (let index = 0; index < usernamesList.length; index++) {
            const username = usernamesList[index];
            const user = await User.getUser(username);
            user.removeDevicePermission(uuid);
        }

        for (let index = 0; index < this.generalData.permissionGroup.length; index++) {
            const permissionGroupId = this.generalData.permissionGroup[index].groupId;
            const permissionGroup = await PermissionGroup.getPermissionGroup(permissionGroupId)
            permissionGroup.removeDevicePermission(uuid);
        }
    }

    async removeTaskPermissionsOfTask(taskId: string) {
        let usernamesList = this.generalData.getUsernameList();

        for (let index = 0; index < usernamesList.length; index++) {
            const username = usernamesList[index];
            const user = await User.getUser(username);
            user.removeTaskPermission(taskId);
        }

        for (let index = 0; index < this.generalData.permissionGroup.length; index++) {
            const permissionGroupId = this.generalData.permissionGroup[index].groupId;
            const permissionGroup = await PermissionGroup.getPermissionGroup(permissionGroupId)
            permissionGroup.removeTaskPermission(taskId);
        }
    }

    async createTask(taskId: string, taskName: string, isOn: boolean, isRepeating: boolean): Promise<void> {
        let task = await Task.createNewTask(taskId, taskName, isOn, isRepeating, [], [], [])
        this.generalData.addTask(taskId)
        this.taskList.push(task)

        appDataInstance.on(AppData.ON_DATA_CHANGE, task.onUpdateData.bind(task));

        console.log("Created new task: " + task.taskName)

        let eventData: AppdataEvent = {
            targetId: taskId,
            event: AppData.ON_TASK_CREATED,
            dataType: -1,
            dataAt: -1,
            oldTopic: "",
        }

        this.triggerCallbacks(eventData)
    }

    async removeTask(taskId: string) {
        let taskName = ""
        await this.generalData.removeTask(taskId);

        for (let i = this.taskList.length - 1; i >= 0; i--) {
            const element = this.taskList[i];
            if (taskId == element.taskId) {
                taskName = element.taskName
                this.taskList.splice(i, 1)
            }
        }

        this.removeTaskPermissionsOfTask(taskId);

        removeFile(`tasks/${taskId}`)
        console.log("Removed task: " + taskName)

        let eventData: AppdataEvent = {
            targetId: taskId,
            event: AppData.ON_TASK_DELETED,
            dataType: -1,
            dataAt: -1,
            oldTopic: "",
        }

        this.triggerCallbacks(eventData)
    }

    public getTaskById(taskId: string): Task {
        for (let index = 0; index < this.taskList.length; index++) {
            const task = this.taskList[index];
            if (task.taskId == taskId) {
                return task
            }
        }
        throw new Error("task not found: " + taskId)
    }

    public getDeviceById(deviceId: string): Device {
        for (let index = 0; index < this.deviceList.length; index++) {
            const device = this.deviceList[index];
            if (device.getUUID() == deviceId) {
                return device
            }
        }
        throw new Error("device not found")
    }

    saveData(): void {
        for (let i = 0; i < this.deviceList.length; i++) {
            const device = this.deviceList[i];
            device.saveData();
        }

        for (let index = 0; index < this.taskList.length; index++) {
            const task = this.taskList[index];
            task.saveData();
        }

        this.generalData.saveData();

        console.log("Saved appData")
    }

    async addGeneralTopic(topicName: string, topicPath: string, isVisible: boolean): Promise<void> {
        try {
            await this.generalData.addTopic(topicName, topicPath, isVisible)
            console.log("added new generalTopic {TopicName: " + topicName + ", TopicPath:" + topicPath + "}")
        } catch (err) {
            throw new Error("err")
        }
    }

    removeGeneralTopic(topicName: string): void {
        this.generalData.removeTopic(topicName);
        console.log("removed generalTopic {TopicName: " + topicName + "}")
    }

    triggerCallbacks(eventData: AppdataEvent): void {
        for (let index = 0; index < this.callbacks.length; index++) {
            const element = this.callbacks[index];
            if (element.event == eventData.event || element.event == AppData.ON_ANY_CHANGE) {
                element.callback(eventData);
            }
        }
    }

    on(event: string, callback: Function): void {
        let newCallback: callback = {
            "event": event,
            "callback": callback
        }
        this.callbacks.push(newCallback)
    }

    off(event: string, callback: Function): void {
        for (let index = this.callbacks.length - 1; index >= 0; index--) {
            const _callback = this.callbacks[index];
            if (_callback.event == event && _callback.callback == callback) {
                this.callbacks.splice(index, 1)
            }

        }
    }

    updateDevice(topic: string, dataPacket: DataPacket) {
        let device: Device
        try {
            device = this.getDeviceById(dataPacket.sender)
        } catch (err) {
            console.log("err")
            return;
        }
        if (dataPacket.dataType == -1) {
            device.setDeviceData(dataPacket.data);
        }
        else {
            if (device.getDeviceData()[dataPacket.dataAt].dataType == dataPacket.dataType) {
                device.setData(dataPacket.dataAt, dataPacket.data);
            }
        }
    }

    // TODO: add topic change to device
}

export { AppData }