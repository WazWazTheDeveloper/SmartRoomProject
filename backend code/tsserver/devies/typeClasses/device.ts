import { device, eventFunctionData, generalTopic, topicData } from '../types'
import data = require('../../utility/file_handler')
import { GeneralTopic } from './generalData'
import { AirconditionerData } from './airconditionerData'

class TopicData implements topicData {
    topicName: string
    topicPath: string
    dataType: string
    event: string
    functionData: eventFunctionData

    constructor(_generalTopic: generalTopic, dataType: string, event: string, functionData: eventFunctionData) {
        this.topicName = _generalTopic.topicName;
        this.topicPath = _generalTopic.topicPath
        this.dataType = dataType
        this.event = event
        this.functionData = functionData
    }
}

class Device implements device {
    static readonly AIRCONDITIONER_TYPE = "airconditioner";

    deviceName:string
    uuid: string
    deviceType: Array<string>
    listenTo: Array<topicData>
    publishTo: Array<topicData>
    isConnected: boolean
    deviceData: Array<any>

    constructor(
        deviceName:string,
        uuid: string,
        deviceType: Array<string>,
        listenTo: Array<topicData>,
        publishTo: Array<topicData>,
        isConnected: boolean,
        deviceData: Array<any>) {
        this.deviceName = deviceName
        this.uuid = uuid
        this.deviceType = deviceType
        this.listenTo = listenTo
        this.publishTo = publishTo
        this.isConnected = isConnected
        this.deviceData = deviceData
    }

    public static async createNewDevice(        
        deviceName: string,
        uuid: string,
        deviceType: Array<string>,
        listenTo: Array<topicData>,
        publishTo: Array<topicData>,
        deviceData: Array<any>){

            let newDevice = new Device(deviceName,uuid,deviceType,[],[],false,[])

            for (let index = 0; index < newDevice.deviceType.length; index++) {
                const _deviceType = newDevice.deviceType[index];
                let _deviceData = Device.getDefaultData(_deviceType)
                newDevice.deviceData.push(_deviceData)
            }
            await newDevice.saveData()
    }

    async saveData(): Promise<void> {
        console.log(`saveing Device object ${this.uuid}`)

        let dataJson: device = {
            deviceName: this.deviceName,
            uuid: this.uuid,
            deviceType: this.deviceType,
            listenTo: this.listenTo,
            publishTo: this.publishTo,
            isConnected: this.isConnected,
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
                deviceData
            )

            return newDevice
        } catch (err) {
            console.log("File read failed:", err);
            throw new Error(err?.toString());
        }
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


    onUpdateData(topic: string, message: string, topicData: TopicData):void {
        // TODO: add more types and cases
        // MAYBE DANIEL FIND ME AND KILL ME 
        // TODO: change the order of checking, first check for type then look for specific function
        let functionToCall: Function = (topic: string, message: string) => { };
        let eventString = topicData.event
        if (eventString.substring(0, 4).includes("data")) {
            let dataNumber = Number(eventString.substring(4));
            if (this.deviceData[dataNumber] && this.deviceType[dataNumber]) {
                switch (topicData.functionData.functionType) {
                    case ("default"): {
                        functionToCall = this.callDefaultFunction(topicData, dataNumber);
                        break;
                    }
                    default: {
                        throw new Error(`function type ${topicData.functionData.functionType} does not exist`)
                        throw new ErrorEvent("dead inside")
                    }
                }
            }
        }

        functionToCall(topic, message);
    }

    private callDefaultFunction(_topicData: topicData, dataNumber: number) {
        // WARN: missing types
        switch (_topicData.dataType) {
            case (Device.AIRCONDITIONER_TYPE): {
                return this.deviceData[dataNumber]?.defaultUpdateFunction
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

    //TODO: add a way to select what kind of data is going to be send, like a diffrence between data0 and data1
    async addListenTopic(_generalTopic: generalTopic, dataType: string, event: string, functionData: eventFunctionData):Promise<void> {
        let newTopicData = new TopicData(_generalTopic, dataType, event, functionData)
        this.listenTo.push(newTopicData)

        await this.saveData();
        console.log("added new ListenTopic");
    }

    async removeListenTopic(_generalTopic: GeneralTopic, dataType: string, event: string, functionData: eventFunctionData) {
        for (let i = this.listenTo.length-1; i >= 0; i--) {
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

        await this.saveData();
    }

    async addPublishTopic(_generalTopic: GeneralTopic, dataType: string, event: string, functionData: eventFunctionData):Promise<void> {
        let newTopicData = new TopicData(_generalTopic, dataType, event, functionData)
        this.publishTo.push(newTopicData)

        await this.saveData();
        console.log("added new ListenTopic");
    }

    //IMPLEMENT removeListenTopic()

    async removePublishTopic(_generalTopic: GeneralTopic, dataType: string, event: string, functionData: eventFunctionData):Promise<void> {
        for (let i = this.publishTo.length-1; i >= 0; i--) {
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

        await this.saveData();

    }

    setVar(varName: string,dataId:number, newContent:any) {
        let event = this.deviceData[dataId].setVar(varName,newContent)

        this.dataChanged(event);
        this.dataChanged("data"+dataId);
    }

    //IMPLEMENT sendData()
    dataChanged(event:string): void {
    }
}


export { Device, TopicData }