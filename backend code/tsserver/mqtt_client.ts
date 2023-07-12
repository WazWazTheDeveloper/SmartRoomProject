import { MqttHandler } from "./utility/mqtt_handler";
import { TopicData } from "./devies/typeClasses/generalData";

const HOST = '10.0.0.12';
const PORT = '1883';

//TODO: place this somewhere alse
//TODO: add a way to recocnice which is which so you can remove then later
interface subType {
    topicData: TopicData
    callbackFunction: Function
}

class SubType implements subType {
    topicData: TopicData;
    callbackFunction: Function;

    constructor(topicData: TopicData, callbackFunction: Function) {
        this.topicData = topicData;
        this.callbackFunction = callbackFunction;
    }
}

var mqttClientInstance: MqttClient;
class MqttClient {
    mqttClient: MqttHandler;
    subscribeList: Array<subType>;

    private constructor(host: string, port: string, subscribeList: Array<subType>) {
        this.mqttClient = new MqttHandler(host, port, this.onMassage);
        this.subscribeList = subscribeList;
    }

    public static async initMqtt(host: string, port: string, subscribeList: Array<subType>) {
        let newMqttClient = new MqttClient(host, port, subscribeList)
        await newMqttClient.mqttClient.connect()
        mqttClientInstance = newMqttClient;


        for (let index = 0; index < subscribeList.length; index++) {
            const element = mqttClientInstance.subscribeList[index];
            mqttClientInstance.mqttClient.subscribe(element.topicData.topicPath, 0);
        }
    }

    public static getMqttClientInstance(): MqttClient {
        if (mqttClientInstance) {
            return mqttClientInstance;
        }
        throw new Error(`mqtt client instance is not initialized`)


    }

    private onMassage(topic: string, message: string) {
        for (let index = 0; index < mqttClientInstance.subscribeList.length; index++) {
            const element = mqttClientInstance.subscribeList[index];

            if (topic == element.topicData.topicPath) {
                element.callbackFunction(topic, message,element.topicData)
            }

        }
    }


    public subscribe(subObject: subType, qos: number) {
        this.subscribeList.push(subObject)
        this.mqttClient.subscribe(subObject.topicData.topicPath, qos);
        return this;
    }

    public unsubscribe(subObject: subType) {
        let arrLength = this.subscribeList.length
        for (let index = arrLength-1; index >= 0; index--) {
            const element = this.subscribeList[index];
            if (subObject == subObject) {
                this.subscribeList.splice(index, 1);
            }

        }
        return this;
    }

    public sendMassage(topic: string, message: string) {
        this.mqttClient.sendMessage(topic, message)
        return this;
    }

}

// const mqttClient = new MqttHandler(HOST, PORT);

// function initMqtt() {
//     mqttClient.connect();


//     mqttClient.subscribe("isAliveRes", 0)

//     //DEL: this
//     mqttClient.onMessage("isAliveRes", temp)
// }

// function sendMessage(topic: string, message: string) {
//     mqttClient.sendMessage(topic, message)
// }

// //DEL: later

// interface deviceInterface {
//     uuid: string
//     isAlive: boolean
// }

// function temp(topic: string, message: string) {

//     console.log(`recived message in topic ${topic}`)
//     console.log(`message`)
//     console.log(message.toString());

//     //TODO:add a check to check if message is UUID in list of UUIDs
//     data.readFile<deviceInterface>("devices/01b68220-abdf-441b-9ae7-fefaf4ba9341").then(device => {
//         device.isAlive = true;
//         data.writeFile("devices/01b68220-abdf-441b-9ae7-fefaf4ba9341", device)
//     }).catch(err => console.log(err))
// }

export { MqttClient, SubType };