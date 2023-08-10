import { Device } from "./classes/device";
import { GeneralData, GeneralTopic, getGeneralDataInstance } from "./classes/generalData";
import { Task } from "./classes/task";
import { removeFile } from "./handlers/file_handler";
import { AppdataEvent } from "./interfaces/appData.interface";
import { DataPacket } from "./classes/dataPacket";

var appDataInstance: AppData;

interface callback {
    event: string
    callback: Function
}


class AppData {
    //on change listeners
    public static readonly ON_DEVICE_TOPIC_CHANGE = "deviceTopicChange";
    public static readonly ON_DEVICE_DATA_CHANGE = "deviceDataChange";
    public static readonly ON_DATA_CHANGE = "dataChange";
    public static readonly ON_DEVICE_DATA_REMOVED = "deviceRemoved";
    public static readonly ON_DEVICE_DATA_ADDED = "deviceAdded";

    private taskList: Array<Task>
    private generalData: GeneralData;
    private deviceList: Array<Device>;
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
        let deviceJson = []
        for (let index = 0; index < this.taskList.length; index++) {
            const task = this.taskList[index];
            deviceJson.push(task.getAsJson())
        }

        let taskJson = []
        for (let index = 0; index < this.deviceList.length; index++) {
            const device = this.deviceList[index];
            taskJson.push(device.getAsJson())
        }
        let json = {
            "taskList": taskJson,
            "generalData": this.generalData.getAsJson(),
            "deviceList": deviceJson
        }

        return json
    }

    public static async init(): Promise<void> {
        if (!appDataInstance) {
            let generalData = await getGeneralDataInstance();
            let devices = await AppData.readDeviceListFromFiles(generalData);
            let tasks = await AppData.readTaskListFromFiles(generalData);
            let newAppDataInstance = new AppData(generalData, devices, tasks);

            for (let index = 0; index < newAppDataInstance.getDeviceList().length; index++) {
                const device = newAppDataInstance.getDeviceList()[index];
                device.setDallbackOnChange(newAppDataInstance.triggerCallbacks)
                
            }

            appDataInstance = newAppDataInstance;
            Task.initDeviceList(devices)

            for (let index = 0; index < tasks.length; index++) {
                const task = tasks[index];
                appDataInstance.on(this.ON_DEVICE_DATA_CHANGE, task.onUpdateData);
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

    // change to createDevice
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


        let eventData : AppdataEvent = {
            deviceUUID:newDevice.getUUID(),
            event: AppData.ON_DEVICE_DATA_ADDED,
            dataType : -1,
            dataAt : -1,
            oldTopic : "",
        }

        this.triggerCallbacks(eventData)
    }

    async removeDevice(uuid: string): Promise<void> {
        await this.generalData.removeDevice(uuid);

        for (let i = this.deviceList.length - 1; i >= 0; i--) {
            const element = this.deviceList[i];
            if (uuid == element.getUUID()) {
                this.deviceList.splice(i, 1)
            }
        }

        removeFile(`devices/${uuid}`)
        console.log(`Removed device ${uuid} from appData`)

        let eventData : AppdataEvent = {
            deviceUUID:uuid,
            event: AppData.ON_DEVICE_DATA_REMOVED,
            dataType : -1,
            dataAt : -1,
            oldTopic : "",
        }

        this.triggerCallbacks(eventData)
    }

    async createTask(taskId: string, taskName: string, isOn: boolean, isRepeating: boolean): Promise<void> {
        let task = await Task.createNewTask(taskId, taskName, isOn, isRepeating, [], [], [])
        this.generalData.addTask(taskId)
        this.taskList.push(task)

        appDataInstance.on(AppData.ON_DEVICE_DATA_CHANGE, task.onUpdateData);

        console.log("Created new task: " + task.taskName)
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

        removeFile(`tasks/${taskId}`)
        console.log("Removed task: " + taskName)
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
        console.log("removed generalTopic {TopicName: "+topicName+"}")
    }

    triggerCallbacks(eventData: AppdataEvent): void {
        for (let index = 0; index < this.callbacks.length; index++) {
            const element = this.callbacks[index];
            if (element.event == eventData.event) {
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

    updateDevice(message: DataPacket) {

    }
}

export { AppData }