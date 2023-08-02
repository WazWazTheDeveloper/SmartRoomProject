import { AppData } from "../AppData";
import { DataPacket } from "../classes/DataPacket";
import { TopicData } from "../classes/topicData";
import { generalTopic } from "../types";
import { MqttClient, SubType } from "../mqtt_client";
import { Task } from "../tasks";
import { Device } from "../classes/device";

//TODO: this is the type you need to send to the mqtt server to commect
// {
//     "sender" : "01b68220-abdf-441b-9ae7-fefaf4ba9342",
//     "dataType" : "*",
//     "event" : "checkIsConnected",
//     "data" : 
//       {"data0" : {
//         "isOn" : false
//       }
//       }
//   }

let checkConnectionObject:CheckConnection;
class CheckConnection {
    static readonly TASKID = "checkIsConnected";
    isConnectedCheckTopic: generalTopic;
    subType: SubType;

    constructor(isConnectedCheckTopic: generalTopic , subType: SubType) {
        this.isConnectedCheckTopic = isConnectedCheckTopic
        this.subType = subType
    }

    static async init() {
        let appData = await AppData.getAppDataInstance();
        let mqttClient = MqttClient.getMqttClientInstance();
        let task: Task;
        let isConnectedCheckTopic;
    
        try {
            isConnectedCheckTopic = appData.getGeneralData().getTopicByName("isConnectedCheckTopic")
        } catch (err) {
            await appData.addGeneralTopic("isConnectedCheckTopic", "isConnectedCheckTopic", false)
            isConnectedCheckTopic = appData.getGeneralData().getTopicByName("isConnectedCheckTopic")
        }
    
        // get the task and if doent exist make a new one
        try {
            task = appData.getTaskById(CheckConnection.TASKID)
        } catch (err) {
            await appData.createTask(CheckConnection.TASKID, "checkIsConnected", true, false)
            task = appData.getTaskById(CheckConnection.TASKID)
            task.addTimedCheck("*/5 * * * * *")
            for (let index = 0; index < appData.getDeviceList().length; index++) {
                const device = appData.getDeviceList()[index];
                task.addTodoTask(device.uuid, -1, "isConnectedCheck", false);
            }
        }

        let newTopicData = new TopicData(isConnectedCheckTopic, TopicData.anyType, false, "checkIsConnected", { "functionType": "*" })
        let newSubType = new SubType(newTopicData, this.onUpdateFromServer)

        checkConnectionObject = new CheckConnection(isConnectedCheckTopic , newSubType)
    
        mqttClient.subscribe(checkConnectionObject.subType, 0)
    
        task.addCallbackOnComplate(checkConnectionObject.updater.bind(checkConnectionObject))
    
        task.setIsOn(true)
    }

    // static async getCheckConnectionInstance() {
    //     if(!checkConnection) {
    //         await CheckConnection.init();
    //     }
    //     return checkConnection
    // }

    static async onUpdateFromServer(topic: string, message: DataPacket, topicData: TopicData): Promise<void> {
        let appData = await AppData.getAppDataInstance();
        if (message.dataType != topicData.dataType) {
            return
        }
        if (message.event != topicData.event) {
            return
        }
        let deviceID = message.sender;
    
        if (deviceID != "server") {
            try {
                let _device = appData.getDeviceById(deviceID)
                _device.setVar("isConnectedCheck", true)
            }
            catch (err) {
                console.log(err)
            }
        }
    }

    static async updateDevicesToCheck() {
        let appData = await AppData.getAppDataInstance();
        let task = appData.getTaskById(CheckConnection.TASKID)
        task.emptyTodoTask()
        for (let index = 0; index < appData.getDeviceList().length; index++) {
            const device = appData.getDeviceList()[index];
            task.addTodoTask(device.uuid, -1, "isConnectedCheck", false);
        }
    }

    async updater(): Promise<void> {
        console.log("starting connection check")
        let mqttClient = MqttClient.getMqttClientInstance();
        let checkConnectionPacket = new DataPacket("server", TopicData.anyType, Device.CHANGE_DATA_EVENT, [])
        mqttClient.sendMassage(this.isConnectedCheckTopic.topicPath, checkConnectionPacket)
    
        setTimeout(async () => {
            let appData = await AppData.getAppDataInstance();
            for (let index = 0; index < appData.getDeviceList().length; index++) {
                try {
                    const device = appData.getDeviceList()[index];
                    device.isConnected = device.isConnectedCheck
                }
                catch (err) { }
            }
    
            appData.getTaskById(CheckConnection.TASKID).setIsOn(true)
            console.log("connection check completed")
        }, 5000)
    }
}

// const TASKID = "checkIsConnected"
// let isConnectedCheckTopic: generalTopic;
// let subType: SubType;
// async function initSubType(): Promise<void> {
//     let newTopicData = new TopicData(isConnectedCheckTopic, "*", false, "checkIsConnected", { "functionType": "*" })
//     let newSubType = new SubType(newTopicData, onUpdateFromServer)

//     subType = newSubType
// }

// async function onUpdateFromServer(topic: string, message: DataPacket, topicData: TopicData): Promise<void> {
//     let appData = await AppData.getAppDataInstance();
//     if (message.dataType != topicData.dataType) {
//         return
//     }
//     if (message.event != topicData.event) {
//         return
//     }
//     let deviceID = message.sender;

//     if (deviceID != "server") {
//         try {
//             let _device = appData.getDeviceById(deviceID)
//             _device.setVar("isConnectedCheck", true)
//         }
//         catch (err) {
//             console.log(err)
//         }
//     }
// }
// async function updateDevicesToCheck() {
//     let appData = await AppData.getAppDataInstance();
//     let task = appData.getTaskById(TASKID)
//     task.emptyTodoTask()
//     for (let index = 0; index < appData.getDeviceList().length; index++) {
//         const device = appData.getDeviceList()[index];
//         task.addTodoTask(device.uuid, -1, "isConnectedCheck", false);
//     }
// }

// async function initConnectionCheck(): Promise<void> {
//     let appData = await AppData.getAppDataInstance();
//     let mqttClient = MqttClient.getMqttClientInstance();
//     let task: Task;

//     try {
//         isConnectedCheckTopic = appData.getGeneralData().getTopicByName("isConnectedCheckTopic")
//     } catch (err) {
//         await appData.addGeneralTopic("isConnectedCheckTopic", "isConnectedCheckTopic", false)
//         isConnectedCheckTopic = appData.getGeneralData().getTopicByName("isConnectedCheckTopic")
//     }

//     // get the task and if doent exist make a new one
//     try {
//         task = appData.getTaskById(TASKID)
//     } catch (err) {
//         await appData.createTask(TASKID, "checkIsConnected", true, false)
//         task = appData.getTaskById(TASKID)
//         task.addTimedCheck("*/5 * * * * *")
//         for (let index = 0; index < appData.getDeviceList().length; index++) {
//             const device = appData.getDeviceList()[index];
//             task.addTodoTask(device.uuid, -1, "isConnectedCheck", false);
//         }
//     }

//     initSubType()
//     mqttClient.subscribe(subType, 0)

//     task.addCallbackOnComplate(updater)

//     task.setIsOn(true)

// }

// async function updater(): Promise<void> {
//     console.log("starting connection check")
//     let mqttClient = MqttClient.getMqttClientInstance();
//     let checkConnectionPacket = new DataPacket("server", "*", "checkIsConnected", [])
//     mqttClient.sendMassage(isConnectedCheckTopic.topicPath, checkConnectionPacket)

//     setTimeout(async () => {
//         let appData = await AppData.getAppDataInstance();
//         for (let index = 0; index < appData.getDeviceList().length; index++) {
//             try {
//                 const device = appData.getDeviceList()[index];
//                 device.isConnected = device.isConnectedCheck
//             }
//             catch (err) { }
//         }

//         appData.getTaskById(TASKID).setIsOn(true)
//         console.log("connection check completed")
//     }, 5000)
// }

export { CheckConnection}