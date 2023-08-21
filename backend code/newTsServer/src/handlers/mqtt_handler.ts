import * as mqtt from "mqtt"
import { DataPacket } from "../models/dataPacket";

class MqttHandler {
    mqttClient: mqtt.MqttClient | null;
    host: string
    port: string
    username: string;
    password: string;
    onMassageCallback: Function
    constructor(host: string, port: string, onMassageCallback: Function) {
        this.mqttClient = null;
        this.host = host;
        this.port = port;
        this.username = ''; // mqtt credentials if these are needed to connect
        this.password = '';
        this.onMassageCallback = onMassageCallback
    }

    async connect() {
        this.mqttClient = await mqtt.connect(`mqtt://${this.host}:${this.port}`, { username: this.username, password: this.password });

        this.mqttClient.on('error', (err) => {
            console.log(err);
            this.mqttClient?.end();
        });

        this.mqttClient.on('connect', () => {
            console.log(`mqtt client connected`);
        });

        this.mqttClient.on('message', (topic, message) => {
            try {
                let _message = JSON.parse(message.toString());
                let newDataPackage: DataPacket = new DataPacket(_message.sender,_message.receiver, _message.dataType, _message.dataAt, _message.event, _message.data)
                this.onMassageCallback(topic, newDataPackage)
            }
            catch (err) {
                console.log(err);
            }
        });

        this.mqttClient.on('close', () => {
            console.log(`mqtt client disconnected`);
        });
    }

    sendMessage(topic: string, message: DataPacket) {
        // console.log(`published: \n "${message}"\n to "${topic}"`);
        let _message = JSON.stringify(message.getAsJson())
        this.mqttClient?.publish(topic, (_message));
        return this;
    }

    subscribe(topic: string, qos = 0) {
        this.mqttClient?.subscribe(topic, { qos: qos } as mqtt.IClientSubscribeOptions);
        return this;
    }

    unsubscribe(topic: string) {
        this.mqttClient?.unsubscribe(topic);
        return this;
    }
}

export { MqttHandler };