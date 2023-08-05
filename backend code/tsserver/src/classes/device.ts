import { device, eventFunctionData, generalTopic, topicData } from '../types'
import data = require('../utility/file_handler')
import { GeneralData, GeneralTopic, getGeneralDataInstance } from './generalData'
import { AirconditionerData } from '../devices/airconditionerData'
import { MqttClient } from '../mqtt_client'
import { DataPacket } from './DataPacket'
import { TopicData } from './topicData'
import { SettingsType } from '../AppData'
import { SwitchData } from '../devices/switchData'

class Device implements device {
    static readonly DEVICE_NAME = "deviceName"
    static readonly isConnected = "isConnected"
    static readonly isConnectedCheck = "isConnectedCheck"

    // types
    static readonly AIRCONDITIONER_TYPE = 0;
    static readonly SWITCH_TYPE = 1;

    // events
    public static readonly CHANGE_SETTINGS_EVENT = 'updateSettings'
    public static readonly CHANGE_DATA_EVENT = 'updateData'

    // function types
    public static readonly DEFAULT_FUNCTION_TYPE = 'default'



    deviceName: string
    uuid: string
    deviceType: Array<number>
    listenTo: Array<TopicData> //topic the SERVER listen to and the DEVICE is reciving
    publishTo: Array<TopicData> //topic the SERVER reciving to and the DEVICE is listen
    isConnected: boolean
    isConnectedCheck: boolean
    deviceData: Array<any>

    constructor(
        deviceName: string,
        uuid: string,
        deviceType: Array<number>,
        listenTo: Array<TopicData>,
        publishTo: Array<TopicData>,
        isConnected: boolean,
        isConnectedCheck: boolean,
        deviceData: Array<any>) {
        this.deviceName = deviceName
        this.uuid = uuid
        this.deviceType = deviceType
        this.listenTo = listenTo
        this.publishTo = publishTo
        this.isConnected = isConnected
        this.isConnectedCheck = isConnectedCheck
        this.deviceData = deviceData
    }

    public static async createNewDevice(
        deviceName: string,
        uuid: string,
        deviceType: Array<number>,
        listenTo: Array<TopicData>,
        publishTo: Array<TopicData>
    ): Promise<Device> {

        let newDevice = new Device(deviceName, uuid, deviceType, listenTo, publishTo, false, false, [])

        for (let index = 0; index < newDevice.deviceType.length; index++) {
            const _deviceType = newDevice.deviceType[index];
            let _deviceData = Device.getDefaultData(_deviceType)
            newDevice.deviceData.push(_deviceData)
        }
        await newDevice.saveData()
        return newDevice;
    }

    async saveData(): Promise<void> {
        console.log(`saveing Device object ${this.uuid}`)

        let jsonArr: Array<any> = [];
        for (let index = 0; index < this.deviceData.length; index++) {
            const device = this.deviceData[index];
            jsonArr.push(device.getAsJson());
        }

        let dataJson: device = {
            deviceName: this.deviceName,
            uuid: this.uuid,
            deviceType: this.deviceType,
            listenTo: this.listenTo,
            publishTo: this.publishTo,
            isConnected: this.isConnected,
            isConnectedCheck: this.isConnectedCheck,
            deviceData: (jsonArr)
        }

        // console.log("jsonArr")
        // console.log(jsonArr);

        await data.writeFile<device>(`devices/${this.uuid}`, dataJson)
        console.log(`done saving Device object ${this.uuid}`)
    }

    static async loadFromFile(uuid: string, deviceData: Array<any>,generalData: GeneralData): Promise<Device> {
        let deviceDataFromJson = await data.readFile<Device>(`devices/${uuid}`);

        let listenToArr: Array<TopicData> = []
        for (let index = 0; index < deviceDataFromJson.listenTo.length; index++) {
            const listenTo = deviceDataFromJson.listenTo[index];
            let generalTopic = generalData.getTopicByName(listenTo.topicName);

            // TODO: functionData is object and not functionData Object
            let newListenTo = new TopicData(generalTopic,listenTo.dataType,listenTo.isVisible,listenTo.event,listenTo.functionData)
            listenToArr.push(newListenTo);
        }

        let publishToArr: Array<TopicData> = []
        for (let index = 0; index < deviceDataFromJson.publishTo.length; index++) {
            const publishTo = deviceDataFromJson.publishTo[index];
            let generalTopic = generalData.getTopicByName(publishTo.topicName);

            // TODO: functionData is object and not functionData Object
            let newListenTo = new TopicData(generalTopic,publishTo.dataType,publishTo.isVisible,publishTo.event,publishTo.functionData)
            publishToArr.push(newListenTo);
        }
        try {
            let newDevice = new Device(
                deviceDataFromJson.deviceName,
                deviceDataFromJson.uuid,
                deviceDataFromJson.deviceType,
                listenToArr,
                publishToArr,
                deviceDataFromJson.isConnected,
                deviceDataFromJson.isConnectedCheck,
                deviceData
            )
            return newDevice
        } catch (err) {
            console.log("File read failed:", err);
            throw new Error(err?.toString());
        }
    }

    getAsJson() {
        let jsonArr: Array<any> = [];
        for (let index = 0; index < this.deviceData.length; index++) {
            const device = this.deviceData[index];
            jsonArr.push(device.getAsJson());
        }

        let dataJson: device = {
            deviceName: this.deviceName,
            uuid: this.uuid,
            deviceType: this.deviceType,
            listenTo: this.listenTo,
            publishTo: this.publishTo,
            isConnected: this.isConnected,
            isConnectedCheck: this.isConnectedCheck,
            deviceData: (jsonArr)
        }

        return dataJson
    }

    getAsJsonForArduino() {
        let jsonArr: Array<any> = [];
        for (let index = 0; index < this.deviceData.length; index++) {
            const device = this.deviceData[index];
            jsonArr.push(device.getAsJson());
        }

        let listenToArr: Array<any> = [];
        for (let index = 0; index < this.listenTo.length; index++) {
            const listenTo = this.listenTo[index];
            listenToArr.push(listenTo.getAsJsonForArduino());
        }

        let publishToArr: Array<any> = [];
        for (let index = 0; index < this.publishTo.length; index++) {
            const publishTo = this.publishTo[index];
            publishToArr.push(publishTo.getAsJsonForArduino());
        }

        // TODO ADD TYPE
        let dataJson = {
            // deviceName: this.deviceName,
            uuid: this.uuid,
            // deviceType: this.deviceType,
            listenTo: listenToArr,
            publishTo: publishToArr,
            isConnected: this.isConnected,
            isConnectedCheck: this.isConnectedCheck,
            deviceData: (jsonArr)
        }

        return dataJson
    }

    getPublishToAsJsonForArduino() {
        // BUG: add check if empty
        let publishToArr: Array<any> = [];
        for (let index = 0; index < this.publishTo.length; index++) {
            const publishTo:TopicData = this.publishTo[index];
            publishToArr.push(publishTo.getAsJsonForArduino());
        }


        let dataJson = {
            arr: publishToArr,
        }

        return dataJson
    }

    getListenToAsJsonForArduino() {
        let listenToArr: Array<any> = [];
        for (let index = 0; index < this.listenTo.length; index++) {
            const listenTo = this.listenTo[index];
            listenToArr.push(listenTo.getAsJsonForArduino());
        }

        let dataJson = {
            arr: listenToArr,
        }

        return dataJson
    }


    async setIsConnected(isConnected: boolean): Promise<void> {
        if (this.isConnected != isConnected) {
            this.isConnected = isConnected;
            await this.saveData();
        }
    }

    checkConnection(): void {
        this.isConnected = false;
    }


    async onUpdateData(topic: string, message: DataPacket, topicData: TopicData): Promise<void> {
        if (message.dataType != topicData.dataType) {
            return
        }
        if (message.event != topicData.event) {
            return
        }

        let functionToCall: Function = (topic: string, message: string) => { };
        let eventString = topicData.event
        let dataNumber = 0;
        try {
            dataNumber = parseInt(eventString.substring(4));
        } catch (err) { }

        // problem is somwhere here
        // TODO: add a check for event
        // TODO: add check event

        if (this.deviceData[dataNumber] && this.deviceType[dataNumber]) {
            if (this.deviceType[dataNumber] != topicData.dataType) {
                return
            }
            if (message.event != topicData.event) {
                return
            }

            // TODO: add more function types
            switch (topicData.functionData.functionType) {
                case (Device.DEFAULT_FUNCTION_TYPE): {
                    functionToCall = this.callDefaultFunction(topicData, dataNumber);
                    break;
                }
                default: {
                    throw new Error(`function type ${topicData.functionData.functionType} does not exist`)
                }
            }
        }

        functionToCall(topic, message.data, dataNumber);
        await this.saveData()
    }

    private callDefaultFunction(_topicData: topicData, dataNumber: number) {
        // TODO: add types
        // TODO take a look maybe the switch here is unnececery as all devices have defaultUpdateFunction()
        switch (_topicData.dataType) {
            case (Device.AIRCONDITIONER_TYPE): {
                return this.deviceData[dataNumber]?.defaultUpdateFunction.bind(this.deviceData[dataNumber])
            }
            case (Device.SWITCH_TYPE): {
                return this.deviceData[dataNumber]?.defaultUpdateFunction.bind(this.deviceData[dataNumber])
            }
            default: {
                throw new Error("device type not found")
            }
        }
    }

    private static getDefaultData(dataType: number) {
        switch (dataType) {
            case (Device.AIRCONDITIONER_TYPE): {
                return new AirconditionerData();
            }
            case (Device.SWITCH_TYPE): {
                return new SwitchData();
            }
            default: {
                throw new Error("device type not found")
            }
        }
    }

    async addPublishTopic(_generalTopic: generalTopic, dataType: number, isVisible: boolean, event: string, functionData: eventFunctionData): Promise<void> {
        let newTopicData = new TopicData(_generalTopic, dataType, isVisible, event, functionData)
        this.publishTo.push(newTopicData)

        await this.saveData();
        this.settingsChanged(Device.CHANGE_SETTINGS_EVENT);
        console.log("added new ListenTopic")
    }

    async removePublishTopic(_generalTopic: GeneralTopic, dataType: number, event: string, functionData: eventFunctionData) {
        for (let i = this.publishTo.length - 1; i >= 0; i--) {
            const element = this.publishTo[i];
            if (
                element.topicName == _generalTopic.topicName,
                element.topicPath == _generalTopic.topicPath,
                element.dataType == dataType,
                element.event == event,
                element.functionData.functionType == functionData.functionType
            ) {
                this.publishTo.splice(i, 1)
                console.log("removed ListenTopic");
            }
        }

        this.settingsChanged(Device.CHANGE_SETTINGS_EVENT);
        await this.saveData();
    }

    async addListenTopic(_generalTopic: GeneralTopic, dataType: number, isVisible: boolean, event: string, functionData: eventFunctionData): Promise<void> {
        let newTopicData = new TopicData(_generalTopic, dataType, isVisible, event, functionData)
        this.listenTo.push(newTopicData)

        await this.saveData();
        this.settingsChanged(Device.CHANGE_SETTINGS_EVENT);
        console.log("added new ListenTopic");
    }

    async removeListenTopic(_generalTopic: GeneralTopic, dataType: number, event: string, functionData: eventFunctionData): Promise<void> {
        for (let i = this.listenTo.length - 1; i >= 0; i--) {
            const element = this.listenTo[i];
            if (
                element.topicName == _generalTopic.topicName &&
                element.topicPath == _generalTopic.topicPath &&
                element.dataType == dataType &&
                element.event == event &&
                element.functionData.functionType == functionData.functionType
            ) {
                this.listenTo.splice(i, 1)
                console.log("removed ListenTopic");
            }
        }

        this.settingsChanged(Device.CHANGE_SETTINGS_EVENT);
        await this.saveData();
    }

    async setVar(varName: string, newContent: any, toTriger = true) {

        switch (varName) {
            //TODO:  add all other cases
            case Device.DEVICE_NAME:
                this.deviceName = String(newContent)
                this.settingsChanged(Device.CHANGE_SETTINGS_EVENT);
                await this.saveData();
                break;
            case Device.isConnected:
                if (this.isConnected != true ? true : false) {
                    this.isConnected = newContent == true ? true : false;
                    this.settingsChanged(Device.CHANGE_SETTINGS_EVENT);
                    await this.saveData();
                    break;
                }
            case Device.isConnectedCheck:
                this.isConnectedCheck = newContent == true ? true : false;
                break;

            default:
                break;
        }

        if (toTriger) {
        }
    }

    async setDataVar(dataId: number, varName: string, newContent: any, toTriger = true) {

        let event = this.deviceData[dataId].setVar(varName, newContent)

        await this.saveData();
        if (toTriger) {
            this.dataChanged(event);
            this.dataChanged("data" + dataId);
        }
    }

    settingsChanged(event: string): void {
        for (let index = 0; index < this.publishTo.length; index++) {
            const topicData = this.publishTo[index];
            if (topicData.event == event) {
                this.sendUpdadedSettings(topicData)
            }
        }
    }

    sendUpdadedSettings(topicData: TopicData): void {
        let client = MqttClient.getMqttClientInstance();
        let data: JSON = JSON.parse(JSON.stringify(new SettingsType(this.listenTo, this.publishTo)))
        let dataSend = new DataPacket("server", topicData.dataType, topicData.event, [data])

        client.sendMassage(topicData.topicPath, dataSend)
    }

    dataChanged(event: string): void {
        for (let index = 0; index < this.publishTo.length; index++) {
            const topicData = this.publishTo[index];
            if (topicData.event == event) {
                for (let jndex = 0; jndex < this.deviceType.length; jndex++) {
                    const dataType = this.deviceType[jndex];
                    if (dataType == topicData.dataType) {
                        this.sendUpdadedData(topicData, jndex)
                    }
                }
            }
        }
    }

    sendUpdadedData(topicData: TopicData, indexOfData: number): void {
        let client = MqttClient.getMqttClientInstance();
        let data: JSON = this.deviceData[indexOfData].getData(topicData.event)
        let dataSend = new DataPacket("server", topicData.dataType, topicData.event, [data])

        client.sendMassage(topicData.topicPath, dataSend)
    }

}


export { Device, TopicData }