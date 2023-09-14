import { AirconditionerData } from "../devices/airconditionerData";
import { DeviceDataType, DeviceType } from "../interfaces/device.interface";
import data = require('../handlers/file_handler')
import { GeneralData, GeneralTopic } from "./generalData";
import { AppdataEvent } from "../interfaces/appData.interface";
import { AppData } from "../appData";
import { SwitchData } from "../devices/switchData";

// implements DeviceType
class Device {
    // device vars
    static readonly DEVICE_NAME = "deviceName"
    static readonly isConnected = "isConnected"
    static readonly isConnectedCheck = "isConnectedCheck"

    // types
    static readonly AIRCONDITIONER_TYPE = 0;
    static readonly SWITCH_TYPE = 1;

    private deviceName: string
    private uuid: string
    private topicPath: string
    private deviceData: Array<DeviceDataType>
    private isConnected: boolean
    private isConnectedCheck: boolean
    private isAccepted: boolean

    // this should be pointing to triggerCallbacks(event: string,uuid:string,dataAt:number) in appData 
    private callbackOnChange: Function

    private constructor(
        deviceName: string,
        uuid: string,
        topicPath: string,
        deviceData: Array<DeviceDataType>,
        isConnected: boolean,
        isConnectedCheck: boolean,
        isAccepted: boolean,
        callbackOnChange: Function = ()=>{}) {
        this.deviceName = deviceName
        this.uuid = uuid
        this.isAccepted = isAccepted
        this.topicPath = topicPath
        this.isConnected = isConnected
        this.isConnectedCheck = isConnectedCheck
        this.deviceData = deviceData
        this.callbackOnChange = callbackOnChange
    }

    public async saveData(): Promise<void> {
        console.log(`saveing Device object ${this.uuid}`)

        let dataJson: DeviceType = this.getAsJson();

        await data.writeFile<DeviceType>(`devices/${this.uuid}`, dataJson)
        console.log(`done saving Device object ${this.uuid}`)
    }

    public static async createNewDevice(
        deviceName: string,
        uuid: string,
        deviceType: Array<number>,
        genetalTopic: GeneralTopic,
        callbackOnChange: Function
    ): Promise<Device> {

        let dataArr: Array<DeviceDataType> = [];
        for (let index = 0; index < deviceType.length; index++) {
            const _deviceType: number = deviceType[index];
            let _deviceData = Device.getDefaultData(_deviceType)
            let deviceDataJson: DeviceDataType = {
                dataType: _deviceType,
                data: _deviceData
            }
            dataArr.push(deviceDataJson)
        }

        let newDevice = new Device(deviceName, uuid, genetalTopic.topicPath, dataArr, false, false, false, callbackOnChange)

        await newDevice.saveData()
        return newDevice;
    }

    private static getDefaultData(dataType: number) {
        switch (dataType) {
            // TODO add Types
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

    public static async loadFromFile(uuid: string, deviceData: Array<number>, generalData: GeneralData, callbackOnChange: Function = ()=>{}): Promise<Device> {
        let deviceDataFromJson = await data.readFile<DeviceType>(`devices/${uuid}`);
        let deviceDataArr: Array<DeviceDataType> = [];
        for (let index = 0; index < deviceDataFromJson.deviceData.length; index++) {
            const element = deviceDataFromJson.deviceData[index];
            deviceDataArr.push({
                dataType: element.dataType,
                data: Device.getDeviceDataFromJson(element.dataType, element.data)
            })
        }
        let newDevice = new Device(
            deviceDataFromJson.deviceName,
            deviceDataFromJson.uuid,
            deviceDataFromJson.topicPath,
            deviceDataArr,
            deviceDataFromJson.isConnected,
            deviceDataFromJson.isConnectedCheck,
            deviceDataFromJson.isAccepted,
            callbackOnChange
        )

        return newDevice;
    }

    private static getDeviceDataFromJson(deviceType: number, data: any) {
        switch (deviceType) {
            case (Device.AIRCONDITIONER_TYPE): {
                let _device = AirconditionerData.createFromJson(data);
                return _device;
            }
            case (Device.SWITCH_TYPE): {
                let _device = SwitchData.createFromJson(data);
                return _device;
            }
            // TODO: add device Types
            
        }
    }

    public getAsJson() {
        let deviceDataJsonArr: Array<DeviceDataType> = [];
        for (let index = 0; index < this.deviceData.length; index++) {
            const device = this.deviceData[index];
            let DeviceDataTypeJson: DeviceDataType = {
                dataType: device.dataType,
                data: device.data.getAsJson()
            }
            deviceDataJsonArr.push(DeviceDataTypeJson);
        }

        let dataJson: DeviceType = {
            deviceName: this.deviceName,
            uuid: this.uuid,
            topicPath: this.topicPath,
            deviceData: deviceDataJsonArr,
            isConnected: this.isConnected,
            isConnectedCheck: this.isConnectedCheck,
            isAccepted: this.isAccepted

        }

        return dataJson
    }

    public getAsJsonForArduino(dataAt: number) {
        const data = this.deviceData[dataAt].data.getAsJson();
        let dataJson: any = {
            data:data
        }

        return data
    }

    setDallbackOnChange(newFucnction:Function) {
        this.callbackOnChange = newFucnction
    }

    public getUUID() {
        return this.uuid;
    }

    public getIsConnectedCheck() {
        return this.isConnectedCheck;
    }

    public getIsConnected() {
        return this.isConnected;
    }

    public getDeviceData() {
        return this.deviceData;
    }

    public getTopicPath() {
        return this.topicPath;
    }

    public setTopicPath(newTopicPath: string) {
        let eventData: AppdataEvent = {
            deviceUUID: this.uuid,
            event: AppData.ON_DEVICE_TOPIC_CHANGE,
            dataType: -1,
            dataAt: -1,
            oldTopic: this.topicPath
        }

        this.topicPath = newTopicPath;

        this.saveData();
        this.callbackOnChange(eventData);
    }

    public getDeviceName() {
        return this.deviceName;
    }

    public setDeviceName(newDeviceName: string) {
        this.saveData();
        this.deviceName = newDeviceName;
    }

    async setVar(dataAt: number, varName: string, newContent: any) {
        let eventData: AppdataEvent = {
            deviceUUID: this.uuid,
            event: AppData.ON_DATA_CHANGE,
            dataType: this.deviceData[dataAt].dataType,
            dataAt: dataAt,
            oldTopic: ""
        }

        this.deviceData[dataAt].data.setVar(varName, newContent);
        this.saveData();

        this.callbackOnChange(eventData);
    }

    async setData(dataAt: number, newContent: any) {
        let eventData: AppdataEvent = {
            deviceUUID: this.uuid,
            event: AppData.ON_DATA_CHANGE,
            dataType: this.deviceData[dataAt].dataType,
            dataAt: dataAt,
            oldTopic: ""
        }

        this.deviceData[dataAt].data.setData(newContent);
        this.saveData();
        this.callbackOnChange(eventData);
    }

    async setDeviceVar(varName: string, newContent: any, toTrigger:boolean = true) {
        let eventData: AppdataEvent = {
            deviceUUID: this.uuid,
            event: AppData.ON_DEVICE_DATA_CHANGE,
            dataType: -1,
            dataAt: -1,
            oldTopic: ""
        }

        switch (varName) {

            //TODO:  add all other cases
            case Device.DEVICE_NAME:
                this.deviceName = String(newContent)
                await this.saveData();
                if(toTrigger) {
                    this.callbackOnChange(eventData);
                }
                break;
            case Device.isConnected:
                if (this.isConnected != newContent) {
                    this.isConnected = newContent;
                    await this.saveData();
                    if(toTrigger) {
                        this.callbackOnChange(eventData);
                    }
                    break;
                }
                // TODO: may be needed to add the topic change
            case Device.isConnectedCheck:
                this.isConnectedCheck = newContent == true ? true : false;
                break;

            default:
                break;
        }

        // TODO: make this go only once
        // this.saveData();
    }

    
    async setDeviceData(newData: any) {
        let eventData: AppdataEvent = {
            deviceUUID: this.uuid,
            event: AppData.ON_DEVICE_DATA_CHANGE,
            dataType: -1,
            dataAt: -1,
            oldTopic: ""
        }

        let keys: Array<string> = Object.keys(newData)

        keys.forEach(key => {
            let newVal = JSON.parse(JSON.stringify(newData))[key]
            try {
                this.setDeviceVar(key, newVal,false)
            } catch (err) {
                //its fine :)
            }
        });

        this.saveData();
        this.callbackOnChange(eventData);
    }
}

export { Device }