import { AirconditionerData } from "../devices/airconditionerData";
import { DeviceDataType, DeviceType } from "../interfaces/device.interface";
import data = require('../handlers/file_handler')
import { GeneralData, GeneralTopic } from "./generalData";
import { AppdataEvent } from "../interfaces/appData.interface";
import { AppData } from "../appData";
import { SwitchData } from "../devices/switchData";
import NumberData from "../devices/numberData";
import MultiStateButtonData from "../devices/multiStateButtonData";

// implements DeviceType
class Device {
    // device vars
    static readonly DEVICE_NAME = "deviceName"
    static readonly isConnected = "isConnected"
    static readonly isConnectedCheck = "isConnectedCheck"

    // isAccepted
    static readonly DEVICE_ACCEPTED_YES = 1
    static readonly DEVICE_ACCEPTED_NO = -1
    static readonly DEVICE_ACCEPTED_UNDEFINED = 0


    // types
    static readonly AIRCONDITIONER_TYPE = 0;
    static readonly SWITCH_TYPE = 1;
    static readonly NUMBER_TYPE = 2;
    static readonly MULTI_STATE_BUTTON_TYPE = 3;

    private deviceName: string
    private uuid: string
    private topicPath: string
    private deviceData: Array<DeviceDataType>
    private isConnected: boolean
    private isConnectedCheck: boolean
    private isAccepted: -1 | 0 | 1
    private isVisible: boolean
    private isAdminOnly: boolean

    // this should be pointing to triggerCallbacks(event: string,uuid:string,dataAt:number) in appData 
    private callbackOnChange: Function

    private constructor(
        deviceName: string,
        uuid: string,
        topicPath: string,
        deviceData: Array<DeviceDataType>,
        isConnected: boolean,
        isConnectedCheck: boolean,
        isAccepted: -1 | 0 | 1, // -1 no | 0 not yet | 1 yes
        isVisible: boolean,
        isAdminOnly: boolean,
        callbackOnChange: Function = () => { }) {
        this.deviceName = deviceName
        this.uuid = uuid
        this.isAccepted = isAccepted
        this.isVisible = isVisible
        this.isAdminOnly = isAdminOnly
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

        let newDevice = new Device(deviceName, uuid, genetalTopic.topicPath, dataArr, false, false, Device.DEVICE_ACCEPTED_UNDEFINED, true, false, callbackOnChange)

        await newDevice.saveData()
        return newDevice;
    }

    private static getDefaultData(dataType: number) {
        switch (dataType) {
            case (Device.AIRCONDITIONER_TYPE): {
                return new AirconditionerData();
            }
            case (Device.SWITCH_TYPE): {
                return new SwitchData();
            }
            case (Device.NUMBER_TYPE): {
                return new NumberData();
            }
            case (Device.MULTI_STATE_BUTTON_TYPE): {
                return new MultiStateButtonData();
            }
            default: {
                throw new Error("device type not found")
            }
            // TODO add Types
        }
    }

    public static async loadFromFile(uuid: string, deviceData: Array<number>, generalData: GeneralData, callbackOnChange: Function = () => { }): Promise<Device> {
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
            deviceDataFromJson.isVisible,
            deviceDataFromJson.isAdminOnly,
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
            case (Device.NUMBER_TYPE): {
                let _device = NumberData.createFromJson(data);
                return _device;
            }
            case (Device.MULTI_STATE_BUTTON_TYPE): {
                let _device = MultiStateButtonData.createFromJson(data);
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
            isAccepted: this.isAccepted,
            isVisible: this.isVisible,
            isAdminOnly: this.isAdminOnly

        }

        return dataJson
    }

    public getAsJsonForArduino(dataAt: number) {
        const data = this.deviceData[dataAt].data.getAsJson();
        let dataJson: any = {
            data: data
        }

        return data
    }

    setCallbackOnChange(newFucnction: Function) {
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
            targetId: this.uuid,
            event: AppData.ON_DEVICE_TOPIC_CHANGE,
            dataType: -1,
            dataAt: -1,
            oldTopic: this.topicPath
        }

        this.topicPath = newTopicPath;

        this.saveData();
        this.callbackOnChange(eventData);
    }

    public getDeviceName(): string {
        return this.deviceName;
    }

    public setDeviceName(newDeviceName: string) {
        this.deviceName = newDeviceName;
        this.saveData();

        console.log(newDeviceName)
        console.log(this.deviceName)

        let eventData: AppdataEvent = {
            targetId: this.uuid,
            event: AppData.ON_DEVICE_DATA_CHANGE,
            dataType: -1,
            dataAt: -1,
            oldTopic: ""
        }

        this.callbackOnChange(eventData);
    }

    public getIsVisible(): boolean {
        return this.isVisible;
    }

    public setIsVisible(_isVisible: boolean) {
        this.isVisible = _isVisible;
        this.saveData();

        let eventData: AppdataEvent = {
            targetId: this.uuid,
            event: AppData.ON_DEVICE_DATA_CHANGE,
            dataType: -1,
            dataAt: -1,
            oldTopic: ""
        }

        this.callbackOnChange(eventData);
    }

    public getIsAccepted(): -1 | 0 | 1 {
        return this.isAccepted;
    }

    public async setIsAccepted(_isAccepted: -1 | 0 | 1) {
        this.isAccepted = _isAccepted;
        await this.saveData();

        let eventData: AppdataEvent = {
            targetId: this.uuid,
            event: AppData.ON_DEVICE_DATA_CHANGE,
            dataType: -1,
            dataAt: -1,
            oldTopic: ""
        }


        this.callbackOnChange(eventData);
    }

    public getIsAdminOnly(): boolean {
        return this.isAdminOnly;
    }

    public setIsAdminOnly(_isAdminOnly: boolean) {
        this.isAdminOnly = _isAdminOnly;
        this.saveData();

        let eventData: AppdataEvent = {
            targetId: this.uuid,
            event: AppData.ON_DEVICE_DATA_CHANGE,
            dataType: -1,
            dataAt: -1,
            oldTopic: ""
        }

        this.callbackOnChange(eventData);
    }

    async setVar(dataAt: number, varName: string, newContent: any) {
        if (this.isAccepted != Device.DEVICE_ACCEPTED_YES) {
            return
        }

        let eventData: AppdataEvent = {
            targetId: this.uuid,
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
        if (this.isAccepted != Device.DEVICE_ACCEPTED_YES) {
            return
        }

        let eventData: AppdataEvent = {
            targetId: this.uuid,
            event: AppData.ON_DATA_CHANGE,
            dataType: this.deviceData[dataAt].dataType,
            dataAt: dataAt,
            oldTopic: ""
        }
        this.deviceData[dataAt].data.setData(newContent);
        this.saveData();
        this.callbackOnChange(eventData);
    }

    async setDeviceVar(varName: string, newContent: any, toTrigger: boolean = true) {
        let eventData: AppdataEvent = {
            targetId: this.uuid,
            event: AppData.ON_DEVICE_DATA_CHANGE,
            dataType: -1,
            dataAt: -1,
            oldTopic: ""
        }

        switch (varName) {

            //TODO:  add more type cases
            case Device.DEVICE_NAME:
                this.deviceName = String(newContent)
                await this.saveData();
                if (toTrigger) {
                    this.callbackOnChange(eventData);
                }
                break;
            case Device.isConnected:
                if (this.isConnected != newContent) {
                    this.isConnected = newContent;
                    await this.saveData();
                    if (toTrigger) {
                        this.callbackOnChange(eventData);
                    }
                    break;
                }
            // TODO:add topic change
            // TODO: add isVisible
            // TODO: add isAccepted
            // TODO: add isAdminOnly
            case Device.isConnectedCheck:
                this.isConnectedCheck = newContent == true ? true : false;
                break;

            default:
                break;
        }
    }


    async setDeviceData(newData: any) {
        let eventData: AppdataEvent = {
            targetId: this.uuid,
            event: AppData.ON_DEVICE_DATA_CHANGE,
            dataType: -1,
            dataAt: -1,
            oldTopic: ""
        }

        let keys: Array<string> = Object.keys(newData)

        keys.forEach(key => {
            let newVal = JSON.parse(JSON.stringify(newData))[key]
            try {
                this.setDeviceVar(key, newVal, false)
            } catch (err) {
                //its fine :)
            }
        });

        this.saveData();
        this.callbackOnChange(eventData);
    }
}

export { Device }