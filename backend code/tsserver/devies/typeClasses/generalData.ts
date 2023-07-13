import { deviceListItem, generalData,generalTopic} from "../types";
import * as data from '../../utility/file_handler'
import { log } from "console";
var GeneralDataInstance: GeneralData;

class GeneralTopic implements generalTopic {
    topicName:string
    topicPath: string

    constructor(topicName:string,topicPath: string) {
        this.topicName = topicName;
        this.topicPath = topicPath

    }
}

class DeviceListItem implements deviceListItem {
    UUID: string //this should be private as you dont want use user to be able to change the UUID (i think?)
    name: string
    deviceType: Array<string>

    constructor(UUID: string, name: string, deviceType: Array<string>) {
        this.UUID = UUID
        this.name = name
        this.deviceType = deviceType
    }
}


class GeneralData implements generalData {
    // TODO: move this to general data.json of to ENV veriable or somting
    static readonly GENERAL_DATA_FILE_NAME = 'generalData';

    topicList: Array<GeneralTopic>;
    deviceList: Array<DeviceListItem>;

    constructor(deviceList: Array<deviceListItem>, topics: Array<generalTopic>) {
        this.deviceList = deviceList;
        this.topicList = topics;
    }

    static async loadFromFile(): Promise<GeneralData> {
        let generalData = await data.readFile<generalData>(`${GeneralData.GENERAL_DATA_FILE_NAME}`);

        try{
            let generalDataObj = new GeneralData(generalData.deviceList, generalData.topicList);
            return generalDataObj
        }catch(err) {
            console.log("File read failed:", err);
            let generalDataObj = new GeneralData([], []);
            generalDataObj.saveData();
            return generalDataObj
        }
    }

    public saveData() {
        console.log("saveing GeneralData object")
        let dataJson: generalData = {
            topicList: this.topicList,
            deviceList: this.deviceList,
        }

        data.writeFile<generalData>(`${GeneralData.GENERAL_DATA_FILE_NAME}`, dataJson)
    }

    public addTopic(topicName: string,topicPath:string) {
        for (let index = 0; index < this.topicList.length; index++) {
            const element = this.topicList[index];
            if(element.topicName == topicName) {
                throw new Error("topic with same name already exist")
            }
            
        }
        let newTopic = new GeneralTopic(topicName,topicPath)
        this.topicList.push(newTopic)
        this.saveData(); 

    }

    public removeTopic(topicName: string){
        for (let i = this.topicList.length-1; i >= 0 ; i--) {
            const element = this.topicList[i];
            if (topicName == element.topicName) {
                this.topicList.splice(i,1)
            }
        }

        this.saveData(); 
    }

    public addDevice(newDevice: DeviceListItem) {
        this.deviceList.push(newDevice)
        this.saveData();
        return this

        //TODO: add console.log
    }

    public removeDevice(uuid:string) {
        for (let i = this.deviceList.length-1; i >= 0 ; i--) {
            const element = this.deviceList[i];
            if (uuid == element.UUID) {
                this.deviceList.splice(i,1)
            }
            
        }
        this.saveData();

        //TODO: add console.log
    }

    public getTopics() {
        return this.topicList;
    }

    public getDeviceList() {
        return this.deviceList;
    }
}

async function getGeneralDataInstance() {
    if (!GeneralDataInstance) {
        let data = await GeneralData.loadFromFile()
        GeneralDataInstance = data;
        return GeneralDataInstance;
    } else {
        return GeneralDataInstance;
    }
}

export { GeneralData, GeneralTopic, DeviceListItem, getGeneralDataInstance }