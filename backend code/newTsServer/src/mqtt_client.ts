import { DataPacket } from "./models/dataPacket";
import { Device } from "./models/device";
import { MqttHandler } from "./handlers/mqtt_handler";

interface SubType {
    topicPath: string
    callbackFunction: Function
}

var mqttClientInstance: MqttClient;
class MqttClient {
    mqttClient: MqttHandler;
    subscribeList: Array<SubType>;

    private constructor(host: string, port: string) {
        this.mqttClient = new MqttHandler(host, port, this.onMassage);
        this.subscribeList = []
    }

    public static async initMqtt(host: string, port: string): Promise<void> {
        let newMqttClient = new MqttClient(host, port)
        await newMqttClient.mqttClient.connect()
        mqttClientInstance = newMqttClient;
    }

    public static getMqttClientInstance(): MqttClient {
        if (mqttClientInstance) {
            return mqttClientInstance;
        }
        throw new Error(`mqtt client instance is not initialized`)
    }

    private onMassage(topic: string, message: DataPacket) {
        for (let index = 0; index < mqttClientInstance.subscribeList.length; index++) {
            const element = mqttClientInstance.subscribeList[index];

            if (topic == element.topicPath) {
                element.callbackFunction(topic, message)
            }

        }
    }

    public subscribe(topicPath: string, callbackFunction: Function, qos = 1) {
        let subType: SubType = {
            topicPath: topicPath,
            callbackFunction: callbackFunction
        }

        this.subscribeList.push(subType)
        this.mqttClient.subscribe(subType.topicPath, qos);
        return this;
    }

    public unsubscribe(topicPath: string, callbackFunction: Function) {
        let arrLength = this.subscribeList.length
        for (let index = arrLength - 1; index >= 0; index--) {
            const element = this.subscribeList[index];
            // TODO: take a look at this
            if (callbackFunction == element.callbackFunction && element.topicPath == topicPath) {
                this.subscribeList.splice(index, 1);
            }

        }
        return this;
    }

    public sendMassage(topic: string, message: DataPacket) {
        this.mqttClient.sendMessage(topic, message)
        return this;
    }

    emptySubscribeList() {
        if(this.subscribeList.length > 0) {
            for (let index = 0; index < this.subscribeList.length; index++) {
                const element = this.subscribeList[index];
                this.mqttClient.unsubscribe(element.topicPath)
            }
        }

        this.subscribeList = [];
    }
}

export { MqttClient};
