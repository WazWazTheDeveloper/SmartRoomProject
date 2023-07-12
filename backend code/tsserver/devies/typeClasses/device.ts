import { device, topicData} from '../types'
import data = require('../../utility/file_handler')
import { TopicData } from './generalData';

class Device implements device{
    static readonly AIRCONDITIONER_TYPE = "airconditioner";


    uuid: string
    deviceType: Array<string>
    listenTo: Array<topicData>
    publishTo: Array<topicData>
    isConnected: boolean
    deviceData: Array<any>

    constructor(
        uuid: string,
        deviceType: Array<string>,
        listenTo: Array<topicData>,
        publishTo: Array<topicData>,
        isConnected: boolean,
        deviceData: Array<any>) {
        this.uuid = uuid
        this.deviceType = deviceType
        this.listenTo = listenTo
        this.publishTo = publishTo
        this.isConnected = isConnected
        this.deviceData = deviceData

        this.saveData();
    }

    saveData(): void {
        console.log(`saveing Device object ${this.uuid}`)

        let dataJson: device = {
            uuid: this.uuid,
            deviceType: this.deviceType,
            listenTo: this.listenTo,
            publishTo: this.publishTo,
            isConnected: this.isConnected,
            deviceData: this.deviceData
        }

        data.writeFile<device>(`devices/${this.uuid}`, dataJson)
    }

    static async loadFromFile(uuid: string, deviceData: Array<any>):Promise<Device> {
        let deviceDataFromJson = await data.readFile<Device>(`devices/${uuid}`);
        try {
            let newDevice = new Device(
                deviceDataFromJson.uuid,
                deviceDataFromJson.deviceType,
                deviceDataFromJson.listenTo,
                deviceDataFromJson.publishTo,
                deviceDataFromJson.isConnected,
                deviceData
            )

            return newDevice
        } catch(err) {
            console.log("File read failed:", err);
            throw new Error(err?.toString());
        }
    }

    setIsConnected(isConnected: boolean): void {
        if(this.isConnected != isConnected) {
            this.isConnected = isConnected;
            this.saveData();
        }
    }

    checkConnection(): void {
        this.isConnected = false;
    }


    onUpdateData(topic: string, message: string,topicData: TopicData) {
        // TODO: add more types and cases
        // TODO: change the order of checking, first check for type then look for specific function
        let functionToCall:Function = (topic: string, message: string) => {};
        let eventString = topicData.event
        if(eventString.substring(0,4).includes("data")) {
            let dataNumber = Number(eventString.substring(4));
            if(this.deviceData[dataNumber] && this.deviceType[dataNumber]){
                switch(topicData.functionData.functionType) {
                    case("default"): {
                        functionToCall = this.callDefaultFunction(topicData,dataNumber);
                        break;
                    }
                    default: {
                        throw new Error(`function type ${topicData.functionData.functionType} does not exist`)
                    }
                }
            }
        }

        functionToCall(topic, message);
    }

    private callDefaultFunction(_topicData: topicData,dataNumber:number) {
        // WARN: missing types
        switch(_topicData.dataType) {
            case(Device.AIRCONDITIONER_TYPE) :{
                return this.deviceData[dataNumber]?.defaultUpdateFunction
            }
            // WARN: add default to throw error
        }
    }

    //TODO: add a way to select what kind of data is going to be send, like a diffrence between data0 and data1
    //IMPLEMENT addListenTopic()
    addListenTopic() {

    }

    //IMPLEMENT addPublishTopic()
    addPublishTopic() {

    }

    //IMPLEMENT removeListenTopic()
    removeListenTopic() {

    }

    //IMPLEMENT removePublishTopic()
    removePublishTopic() {

    }

    //IMPLEMENT reciveData()
    reciveData() {

    }

    //IMPLEMENT sendData()
    sendData():void {

    }
}


export { Device }