import { deviceListItem, eventFunctionData, generalData, topicData } from "../types";
import * as data from '../../utility/file_handler'
var GeneralDataInstance: GeneralData;

class TopicData implements topicData {
    name:string
    topicPath: string
    dataType: string
    event : string
    functionData: eventFunctionData

    constructor(name:string,topicPath: string, dataType: string,event : string,functionData: eventFunctionData) {
        this.name = name;
        this.topicPath = topicPath
        this.dataType = dataType
        this.event = event
        this.functionData = functionData
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

    topicList: Array<TopicData>;
    deviceList: Array<DeviceListItem>;

    constructor(deviceList: Array<deviceListItem>, topics: Array<TopicData>) {
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

    public addTopic(newTopic: TopicData) {
        this.topicList.push(newTopic)
        this.saveData();
        return this
    }

    public addDevice(newDevice: DeviceListItem) {
        this.deviceList.push(newDevice)
        this.saveData();
        return this
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

export { GeneralData, TopicData, DeviceListItem, getGeneralDataInstance }