import { device, eventFunctionData, generalTopic, topicData } from '../types'
import data = require('../utility/file_handler')
import { GeneralTopic } from './generalData'
import { AirconditionerData } from './airconditionerData'
import { MqttClient } from '../mqtt_client'
import { DataPacket } from './DataPacket'
import { TopicData } from './topicData'
import { SettingsType } from '../AppData'

class Device implements device {
    static readonly AIRCONDITIONER_TYPE = "airconditioner";

    deviceName: string
    uuid: string
    deviceType: Array<string>
    listenTo: Array<topicData> //topic the SERVER listen to and the DEVICE is reciving
    publishTo: Array<topicData> //topic the SERVER reciving to and the DEVICE is listen
    isConnected: boolean
    isConnectedCheck: boolean
    deviceData: Array<any>

    constructor(
        deviceName: string,
        uuid: string,
        deviceType: Array<string>,
        listenTo: Array<topicData>,
        publishTo: Array<topicData>,
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
        deviceType: Array<string>,
        listenTo: Array<topicData>,
        publishTo: Array<topicData>,
        deviceData: Array<any>) {

        let newDevice = new Device(deviceName, uuid, deviceType, [], [], false, false, [])

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

        // TODO: change deviceData: this.deviceData to get actual json fron getAsJson insted to json a hole object :)
        let dataJson: device = {
            deviceName: this.deviceName,
            uuid: this.uuid,
            deviceType: this.deviceType,
            listenTo: this.listenTo,
            publishTo: this.publishTo,
            isConnected: this.isConnected,
            isConnectedCheck: this.isConnectedCheck,
            deviceData: this.deviceData
        }

        await data.writeFile<device>(`devices/${this.uuid}`, dataJson)
        console.log(`done saving Device object ${this.uuid}`)
    }

    static async loadFromFile(uuid: string, deviceData: Array<any>): Promise<Device> {
        let deviceDataFromJson = await data.readFile<Device>(`devices/${uuid}`);
        try {
            let newDevice = new Device(
                deviceDataFromJson.deviceName,
                deviceDataFromJson.uuid,
                deviceDataFromJson.deviceType,
                deviceDataFromJson.listenTo,
                deviceDataFromJson.publishTo,
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
        let json = {
            "deviceName" : this.deviceName,
            "uuid" : this.uuid,
            "deviceType" : this.deviceType,
            "listenTo" : this.listenTo,
            "publishTo" : this.publishTo,
            "isConnected" : this.isConnected,
            "deviceData" : this.deviceData
        }

        return json
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

        // problem is somwhere here
        if (this.deviceData[dataNumber] && this.deviceType[dataNumber]) {
            dataNumber = parseInt(eventString.substring(4));
            // TODO: add types
            switch (topicData.functionData.functionType) {
                case ("default"): {
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
        switch (_topicData.dataType) {
            case (Device.AIRCONDITIONER_TYPE): {
                return this.deviceData[dataNumber]?.defaultUpdateFunction.bind(this.deviceData[dataNumber])
            }
            default: {
                throw new Error("device type not found")
            }
        }
    }

    private static getDefaultData(dataType: string) {
        switch (dataType) {
            case (Device.AIRCONDITIONER_TYPE): {
                return new AirconditionerData();
            }
            default: {
                throw new Error("device type not found")
            }
        }
    }

    async addPublishTopic(_generalTopic: generalTopic, dataType: string, isVisible: boolean, event: string, functionData: eventFunctionData): Promise<void> {
        let newTopicData = new TopicData(_generalTopic, dataType, isVisible, event, functionData)
        this.publishTo.push(newTopicData)

        await this.saveData();
        this.settingsChanged("updateSettings");
        console.log("added new ListenTopic")
    }

    async removePublishTopic(_generalTopic: GeneralTopic, dataType: string, event: string, functionData: eventFunctionData) {
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

        this.settingsChanged("updateSettings");
        await this.saveData();
    }

    async addListenTopic(_generalTopic: GeneralTopic, dataType: string, isVisible: boolean, event: string, functionData: eventFunctionData): Promise<void> {
        let newTopicData = new TopicData(_generalTopic, dataType, isVisible, event, functionData)
        this.listenTo.push(newTopicData)

        await this.saveData();
        this.settingsChanged("updateSettings");
        console.log("added new ListenTopic");
    }

    async removeListenTopic(_generalTopic: GeneralTopic, dataType: string, event: string, functionData: eventFunctionData): Promise<void> {
        for (let i = this.listenTo.length - 1; i >= 0; i--) {
            const element = this.listenTo[i];
            if (
                element.topicName == _generalTopic.topicName,
                element.topicPath == _generalTopic.topicPath,
                element.dataType == dataType,
                element.event == event,
                element.functionData.functionType == functionData.functionType
            ) {
                this.listenTo.splice(i, 1)
                console.log("removed ListenTopic");
            }
        }

        this.settingsChanged("updateSettings");
        await this.saveData();
    }

    async setVar(varName: string, newContent: any, toTriger = true) {

        switch (varName) {
            //TODO:  add all other cases
            case "isConnected":
                this.isConnected = newContent == true ? true : false;
                break;
            case "isConnectedCheck":
                this.isConnectedCheck = newContent == true ? true : false;
                break;

            default:
                break;
        }

        await this.saveData();
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