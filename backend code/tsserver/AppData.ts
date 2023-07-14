import { log } from "console";
import { eventFunctionData, generalTopic, topicData } from './devies/types'
import { AirconditionerData } from "./devies/typeClasses/airconditionerData";
import { Device, TopicData } from "./devies/typeClasses/device";
import { DeviceListItem, GeneralData, getGeneralDataInstance } from "./devies/typeClasses/generalData";
import { removeFile } from "./utility/file_handler";
import { SubType } from "./mqtt_client";


var appDataInstance: AppData;
class AppData {
    private generalData: GeneralData;
    private deviceList: Array<Device>;
    private onDeviceTopicChangeFunctions: Array<Function>

    private constructor(generalData: GeneralData, devices: Array<Device>) {
        this.generalData = generalData;
        this.deviceList = devices;
        this.onDeviceTopicChangeFunctions = []
    }

    public static async getAppDataInstance(): Promise<AppData> {
        if (!appDataInstance) {
            let generalData = await getGeneralDataInstance();
            let devices = await AppData.readDeviceListFromFiles(generalData);

            let newAppDataInstance = new AppData(generalData, devices);
            appDataInstance = newAppDataInstance;
            return appDataInstance;
        }
        else {
            return appDataInstance;
        }


    }

    private static async readDeviceListFromFiles(generalData: GeneralData) {
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

    private static async readDeviceFromFile(uuid: string, deviceType: Array<string>) {
        let deviceData: Array<any> = [];
        for (let i = 0; i < deviceType.length; i++) {
            const element = deviceType[i];
            try {
                // WARN: missing types
                switch (element) {
                    case (Device.AIRCONDITIONER_TYPE): {
                        deviceData.push(await AirconditionerData.loadFromFile(uuid, i));
                    }
                }

                return deviceData;
            } catch (err) {
                throw new Error("unable to read deviceData")
            }
        }



        return deviceData;
    }

    public getGeneralData() {
        return this.generalData;
    }

    public getDeviceList() {
        return this.deviceList;
    }

    public addDevice(deviceName: string, uuid: string, deviceType: Array<string>, listenTo?: Array<topicData>, publishTo?: Array<topicData>): void {
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
            log(newDeviceData)
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


        let newDevice = new Device(deviceName, uuid, deviceType, _listenTo, _publishTo, false, deviceDataList);

        this.deviceList.push(newDevice);
        this.generalData.addDevice(newDeviceGeneralData);
    }


    removeDevice(uuid: string): void {
        this.generalData.removeDevice(uuid);

        for (let i = this.deviceList.length - 1; i >= 0; i--) {
            const element = this.deviceList[i];
            if (uuid == element.uuid) {
                this.deviceList.splice(i, 1)
            }
        }

        removeFile(`devices/${uuid}`)
    }

    private getDefaultDeviceData(deviceType: string): AirconditionerData {
        // WARN: missing types
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
        //implement this first
        for (let index = 0; index < this.deviceList.length; index++) {
            const element = this.deviceList[index];
            if (element.uuid == uuid) {
                await element.addPublishTopic(_generalTopic, dataType, event, functionData);
            }

        }

        this.onDeviceTopicChange();
    }

    async removePublishToTopicToDevice(uuid: string, _generalTopic: generalTopic, dataType: string, event: string, functionData: eventFunctionData): Promise<void> {
        for (let index = 0; index < this.deviceList.length; index++) {
            const element = this.deviceList[index];
            if (element.uuid == uuid) {
                await element.removePublishTopic(_generalTopic, dataType, event, functionData);
            }

        }

        this.onDeviceTopicChange();
    }

    // IMPLEMENT addPublishToTopicToDevice()
    addListenToTopicToDevice(uuid: string) {

    }

    // IMPLEMENT addPublishToTopicToDevice()
    removeListenToTopicToDevice(uuid: string) {

    }

    private onDeviceTopicChange(): void {
        let topicDataList: Array<TopicData> = [];
        for (let index = 0; index < this.deviceList.length; index++) {
            const device = this.deviceList[index];
            for (let index = 0; index < device.publishTo.length; index++) {
                const topic = device.publishTo[index];
                topicDataList.push(topic);
            }
        }

        for (let index = 0; index < this.onDeviceTopicChangeFunctions.length; index++) {
            const callbackFunction = this.onDeviceTopicChangeFunctions[index];
            // TODO: add proper variables to this
            callbackFunction(topicDataList);
        }
    }

    public addOnDeviceTopicChangeListener(_function: Function): void {
        this.onDeviceTopicChangeFunctions.push(_function)
        console.log("added on device topic change listener")
    }

    public removeOnDeviceTopicChangeListener(_function: Function): void {
        for (let index = 0; index < this.onDeviceTopicChangeFunctions.length; index++) {
            const element = this.onDeviceTopicChangeFunctions[index];
            if (element == _function) {
                this.onDeviceTopicChangeFunctions.splice(index, 1)
                console.log("removed on device topic change listener")
            }
        }
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

        return(subTypeList)
    }
}
export { AppData }