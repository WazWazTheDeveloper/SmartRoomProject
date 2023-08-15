import { AppData } from "../appData";
import { DataPacket } from "../classes/dataPacket";
import { Device } from "../classes/device";
import { GeneralTopic } from "../classes/generalData";
import { Task } from "../classes/task";
import { MqttClient } from "../mqtt_client";

let checkConnectionObject: CheckConnection;

class CheckConnection {
    static readonly TASKID = "checkIsConnected";

    isConnectedCheckTopic: GeneralTopic;

    constructor(isConnectedCheckTopic: GeneralTopic) {
        this.isConnectedCheckTopic = isConnectedCheckTopic

        this.onMassageFromMqtt = this.onMassageFromMqtt.bind(this)
        this.updater = this.updater.bind(this)
    }

    static async init() {
        let appData = await AppData.getAppDataInstance();
        let mqttClient = MqttClient.getMqttClientInstance();
        let task: Task;
        let isConnectedCheckTopic;

        // getGeneralTopic
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
                task.addTodoTask(device.getUUID(), -1, "isConnectedCheck", false);
            }
        }

        checkConnectionObject = new CheckConnection(isConnectedCheckTopic)

        mqttClient.subscribe(isConnectedCheckTopic.topicPath, checkConnectionObject.onMassageFromMqtt)

        task.setCallbackOnComplate(checkConnectionObject.updater)

        task.setIsOn(true)
    }

    async onMassageFromMqtt(topic: string, message: DataPacket): Promise<void> {
        let appData = await AppData.getAppDataInstance();
        // if (message.dataType != topicData.dataType) {
        //     return
        // }
        if (message.event != DataPacket.CHECK_IS_CONNECTED) {
            return
        }
        let deviceID = message.sender;

        if (deviceID != DataPacket.SENDER_SERVER) {
            try {
                let _device = appData.getDeviceById(deviceID)
                _device.setDeviceVar(Device.isConnectedCheck, true)
            }
            catch (err) {
                console.log(err)
            }
        }
    }

    // DEL: unneccecery
    // static async updateDevicesToCheck() {
    //     let appData = await AppData.getAppDataInstance();
    //     let task = appData.getTaskById(CheckConnection.TASKID)
    //     task.emptyTodoTask()
    //     for (let index = 0; index < appData.getDeviceList().length; index++) {
    //         const device = appData.getDeviceList()[index];
    //         task.addTodoTask(device.getUUID(), -1, "isConnectedCheck", false);
    //     }
    // }

    async updater(): Promise<void> {
        console.log("starting connection check")
        let appData = await AppData.getAppDataInstance();

        // set check val to false
        let devices = appData.getDeviceList();
        for (let index = 0; index < devices.length; index++) {
            const device = devices[index];
            device.setDeviceVar("isConnectedCheck",false);
            
        }        

        let mqttClient = MqttClient.getMqttClientInstance();
        let checkConnectionPacket = new DataPacket(DataPacket.SENDER_SERVER, DataPacket.REVEIVER_ALL, -1, -1, DataPacket.CHECK_IS_CONNECTED, {})
        mqttClient.sendMassage(this.isConnectedCheckTopic.topicPath, checkConnectionPacket)

        setTimeout(async () => {
            let appData = await AppData.getAppDataInstance();
            for (let index = 0; index < appData.getDeviceList().length; index++) {
                try {
                    const device = appData.getDeviceList()[index];
                    device.setDeviceVar(Device.isConnected, device.getIsConnectedCheck())
                }
                catch (err) { }
            }

            appData.getTaskById(CheckConnection.TASKID).setIsOn(true)
            console.log("connection check completed")
        }, 5000)
    }
}

export { CheckConnection }