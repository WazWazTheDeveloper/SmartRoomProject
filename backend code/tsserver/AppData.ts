import { log } from "console";
import { AirconditionerData } from "./devies/typeClasses/airconditionerData";
import { Device } from "./devies/typeClasses/device";
import { DeviceListItem, GeneralData, getGeneralDataInstance } from "./devies/typeClasses/generalData";
import { topicEvent } from "./devies/types";


var appDataInstance: AppData;
class AppData {
    private generalData: GeneralData;
    private deviceList: Array<Device>;

    private constructor(generalData: GeneralData, devices: Array<Device>) {
        this.generalData = generalData;
        this.deviceList = devices;
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
        let deviceData = [];
        for (let i = 0; i < deviceType.length; i++) {
            const element = deviceType[i];
            try {
                // WARN: missing types
                switch (element) {
                    case (Device.AIRCONDITIONER_TYPE): {
                        deviceData.push(await AirconditionerData.loadFromFile(uuid));
                    }
                }

                return deviceData;
            } catch (err) {
                //TODO: add error massage when unableto get file
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

    public addNewDevice(uuid: string, name: string, deviceType: Array<string>, listenTo?: Array<topicEvent> ,publishTo?: Array<topicEvent>) {
        if (Array.isArray(deviceType) && deviceType.length == 0) {
            throw new Error("deviceTypeList should not be empty");
        }

        for (let i = 0; i < this.generalData.getDeviceList().length; i++) {
            const element = this.generalData.getDeviceList()[i];
            if (element.UUID == uuid) {
                throw new Error("UUID is taken");
            }
        }
        
        let newDeviceGeneralData = new DeviceListItem(uuid, name, deviceType);

        let deviceDataList: Array<any> = [];
        for (let i = 0; i < deviceType.length; i++) {
            const element = deviceType[i];
            let newDeviceData = this.getDefaultDeviceData(element);
            log(newDeviceData)
            deviceDataList.push(newDeviceData);
        }
        
        let _publishTo: Array<topicEvent> = [];
        let _listenTo: Array<topicEvent> = [];
        if(Array.isArray(deviceType) && deviceType.length != 0) {
            _publishTo = publishTo!
        }
        if(Array.isArray(deviceType) && deviceType.length != 0) {
            _listenTo = listenTo!
        }
        let newDevice = new Device(uuid, deviceType, _listenTo, _publishTo, false, deviceDataList);

        this.deviceList.push(newDevice);
        this.generalData.addDevice(newDeviceGeneralData);
    }

    private getDefaultDeviceData(deviceType: string) {
        // WARN: missing types
        switch (deviceType) {
            case (Device.AIRCONDITIONER_TYPE): {
                return new AirconditionerData();
            }
            default:{
                throw new Error(`unknown device type "${deviceType}"`)
            }
        }
    }

    public saveData() {
        for (let i = 0; i < this.deviceList.length; i++) {
            const device = this.deviceList[i];
            device.saveData();
        }

        this.generalData.saveData();
    }

}

export { AppData }