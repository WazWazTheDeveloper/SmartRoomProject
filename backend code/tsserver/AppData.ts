
import { eventFunctionData, generalTopic, topicData } from './devices/types'
import { AirconditionerData } from "./devices/typeClasses/airconditionerData";
import { Device, TopicData } from "./devices/typeClasses/device";
import { DeviceListItem, GeneralData, GeneralTask, getGeneralDataInstance } from "./devices/typeClasses/generalData";
import { removeFile } from "./utility/file_handler";
import { SubType } from "./mqtt_client";
import { Task, ToDoTask, VarCheck } from './tasks';
import { initAllScheduledFunctions } from './scheduledFunctions';

interface callbackData {
    event: string
    callback: Function
}

var appDataInstance: AppData;
class AppData {
    public static readonly ON_DEVICE_TOPIC_CHANGE = "deviceTopicChange";
    public static readonly ON_DEVICE_DATA_CHANGE = "deviceTopicChange";

    private taskList: Array<Task>
    private generalData: GeneralData;
    private deviceList: Array<Device>;
    private callbacks: Array<callbackData>

    private constructor(generalData: GeneralData, devices: Array<Device>, taskList: Array<Task>) {
        this.generalData = generalData;
        this.deviceList = devices;
        this.taskList = taskList;
        this.callbacks = [];
    }

    public static async init(): Promise<void> {
        if (!appDataInstance) {
            let generalData = await getGeneralDataInstance();
            let devices = await AppData.readDeviceListFromFiles(generalData);
            let tasks = await AppData.readTaskListFromFiles(generalData);
            let newAppDataInstance = new AppData(generalData, devices, tasks);

            appDataInstance = newAppDataInstance;
            Task.initDeviceList(devices)

            for (let index = 0; index < tasks.length; index++) {
                const task = tasks[index];
                appDataInstance.on(this.ON_DEVICE_DATA_CHANGE , task.onUpdateData);
            }
        }
    }

    private static async readTaskListFromFiles(generalData: GeneralData): Promise<Array<Task>> {
        let taskList = generalData.getTaskList();
        let newTaskList: Array<Task> = [];
        for (let i = 0; i < taskList.length; i++) {
            const task = taskList[i];
            // let taskData = await this.readTaskFromFiles(task.taskId)
            let newDevice = await Task.loadFromFile(task.taskId)
            newTaskList.push(newDevice);
        }
        
        return newTaskList
    }

    public static async getAppDataInstance(): Promise<AppData> {
        if (!appDataInstance) {
            let generalData = await getGeneralDataInstance();
            let devices = await AppData.readDeviceListFromFiles(generalData);
            let tasks = await AppData.readTaskListFromFiles(generalData);

            let newAppDataInstance = new AppData(generalData, devices, tasks);
            
            appDataInstance = newAppDataInstance;
            Task.initDeviceList(devices)

            for (let index = 0; index < tasks.length; index++) {
                const task = tasks[index];
                appDataInstance.on(this.ON_DEVICE_DATA_CHANGE , task.onUpdateData);
            }

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
            let deviceData = await this.readDeviceFromFile(device.UUID, device.deviceType)
            let newDevice = await Device.loadFromFile(device.UUID, deviceData)
            newDeviceList.push(newDevice);
        }

        return newDeviceList

    }

    private static async readDeviceFromFile(uuid: string, deviceType: Array<string>): Promise<Array<any>> {
        let deviceData: Array<any> = [];
        for (let i = 0; i < deviceType.length; i++) {
            const element = deviceType[i];
            try {
                //TODO : add types
                switch (element) {
                    case (Device.AIRCONDITIONER_TYPE): {
                        deviceData.push(await AirconditionerData.loadFromFile(uuid, i));
                    }
                }

            } catch (err) {
                throw new Error("unable to read deviceData")
            }
        }
        return deviceData;
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

    public async addDevice(deviceName: string, uuid: string, deviceType: Array<string>, listenTo?: Array<topicData>, publishTo?: Array<topicData>):Promise<void> {
        if (Array.isArray(deviceType) && deviceType.length == 0) {
            throw new Error("deviceTypeList should not be empty");
        }

        for (let i = 0; i < this.generalData.getDeviceList().length; i++) {
            const element = this.generalData.getDeviceList()[i];
            if (element.UUID == uuid) {
                throw new Error("UUID is taken");
            }
        }

        let newDeviceGeneralData = new DeviceListItem(uuid, deviceName, deviceType);

        let deviceDataList: Array<any> = [];
        for (let i = 0; i < deviceType.length; i++) {
            const element = deviceType[i];
            let newDeviceData = this.getDefaultDeviceData(element);
            console.log(newDeviceData)
            deviceDataList.push(newDeviceData);
        }

        let _publishTo: Array<topicData> = [];
        let _listenTo: Array<topicData> = [];
        if (Array.isArray(deviceType) && deviceType.length != 0) {
            _publishTo = publishTo!
        }
        if (Array.isArray(deviceType) && deviceType.length != 0) {
            _listenTo = listenTo!
        }


        //TODO: change this to use Device.createNewDevice()
        let newDevice = new Device(deviceName, uuid, deviceType, _listenTo, _publishTo, false, deviceDataList);

        this.deviceList.push(newDevice);
        this.generalData.addDevice(newDeviceGeneralData);
    }


    async removeDevice(uuid: string):Promise<void> {
        await this.generalData.removeDevice(uuid);

        for (let i = this.deviceList.length - 1; i >= 0; i--) {
            const element = this.deviceList[i];
            if (uuid == element.uuid) {
                this.deviceList.splice(i, 1)
            }
        }

        removeFile(`devices/${uuid}`)
    }

    // IMPLEMENT addTask()
    async addTask(taskId: string, taskName: string, taskType: string, isOn: boolean, isRepeating: boolean): Promise<void>{
        let task = await Task.createNewTask(taskId,taskName,taskType,isOn,isRepeating,[],[],[])
        let generalTask = new GeneralTask(taskId)

        this.generalData.addTask(generalTask)
        this.taskList.push(task)
        appDataInstance.on(AppData.ON_DEVICE_DATA_CHANGE , task.onUpdateData);
    }

    // IMPLEMENT removeTask()
    async removeTask(taskId:string) {

    }

    private getDefaultDeviceData(deviceType: string): AirconditionerData {
        //TODO : add types
        switch (deviceType) {
            case (Device.AIRCONDITIONER_TYPE): {
                return new AirconditionerData();
            }
            default: {
                throw new Error(`unknown device type "${deviceType}"`)
            }
        }
    }

    public saveData(): void {
        for (let i = 0; i < this.deviceList.length; i++) {
            const device = this.deviceList[i];
            device.saveData();
        }

        for (let index = 0; index < this.taskList.length; index++) {
            const task = this.taskList[index];
            task.saveData();
        }

        this.generalData.saveData();
    }

    addGeneralTopic(topicName: string, topicPath: string): void {
        this.generalData.addTopic(topicName, topicPath)
        console.log(`added new generalTopic {TopicName: ${topicName}, TopicPath: ${topicPath}}`)
    }

    removeGeneralTopic(topicName: string): void {
        this.generalData.removeTopic(topicName);
        console.log(`removed generalTopic {TopicName: ${topicName}}`)
    }

    async addPublishToTopicToDevice(uuid: string, _generalTopic: generalTopic, dataType: string, event: string, functionData: eventFunctionData): Promise<void> {
        for (let index = 0; index < this.deviceList.length; index++) {
            const element = this.deviceList[index];
            if (element.uuid == uuid) {
                await element.addPublishTopic(_generalTopic, dataType, event, functionData);
            }

        }

        this.triggerCallbacks(AppData.ON_DEVICE_TOPIC_CHANGE);
    }

    async removePublishToTopicToDevice(uuid: string, _generalTopic: generalTopic, dataType: string, event: string, functionData: eventFunctionData): Promise<void> {
        for (let index = 0; index < this.deviceList.length; index++) {
            const element = this.deviceList[index];
            if (element.uuid == uuid) {
                await element.removePublishTopic(_generalTopic, dataType, event, functionData);
            }

        }

        this.triggerCallbacks(AppData.ON_DEVICE_TOPIC_CHANGE);
    }

    async addListenToTopicToDevice(uuid: string, _generalTopic: generalTopic, dataType: string, event: string, functionData: eventFunctionData): Promise<void> {
        for (let index = 0; index < this.deviceList.length; index++) {
            const element = this.deviceList[index];
            if (element.uuid == uuid) {
                await element.addListenTopic(_generalTopic, dataType, event, functionData);
            }

        }

        this.triggerCallbacks(AppData.ON_DEVICE_TOPIC_CHANGE);
    }
    
    
    async removeListenToTopicToDevice(uuid: string, _generalTopic: generalTopic, dataType: string, event: string, functionData: eventFunctionData): Promise<void> {
        for (let index = 0; index < this.deviceList.length; index++) {
            const element = this.deviceList[index];
            if (element.uuid == uuid) {
                await element.removeListenTopic(_generalTopic, dataType, event, functionData);
            }
            
        }
        
        this.triggerCallbacks(AppData.ON_DEVICE_TOPIC_CHANGE);
    }

    private triggerCallbacks(event: string): void {
        for (let index = 0; index < this.callbacks.length; index++) {
            const element = this.callbacks[index];
            switch (event) {
                case (AppData.ON_DEVICE_TOPIC_CHANGE): {
                    this.onDeviceTopicChange(element.callback);
                }
                case (AppData.ON_DEVICE_DATA_CHANGE): {
                    this.onDeviceDataChege(element.callback)
                }
            }
        }
    }

    private onDeviceTopicChange(callback: Function): void {
        let topicDataList: Array<TopicData> = [];
        for (let index = 0; index < this.deviceList.length; index++) {
            const device = this.deviceList[index];
            for (let index = 0; index < device.publishTo.length; index++) {
                const topic = device.publishTo[index];
                topicDataList.push(topic);
            }
        }

        callback(topicDataList);
    }

    // IMPLEMENT onDeviceDataChege()
    private onDeviceDataChege(callback: Function):void {
        callback();
    }

    //HACK: probably want to find a better way to do it
    public getSubTypeList(): Array<SubType> {
        let subTypeList: Array<SubType> = []
        for (let index = 0; index < this.deviceList.length; index++) {
            const device = this.deviceList[index];
            for (let index = 0; index < device.listenTo.length; index++) {
                const topic = device.listenTo[index];
                let newSub = new SubType(topic, device.onUpdateData.bind(device))
                subTypeList.push(newSub)
            }
        }

        return (subTypeList)
    }


    on(event: string, callback: Function): void {
        let newCallback = {
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
}
export { AppData }