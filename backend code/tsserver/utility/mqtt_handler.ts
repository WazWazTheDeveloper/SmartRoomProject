import { connect } from "http2";
import * as mqtt from "mqtt"

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
            this.onMassageCallback(topic, message.toString())
        });

        this.mqttClient.on('close', () => {
            console.log(`mqtt client disconnected`);
        });
    }

    //TODO: add option to remove on Message with id or somting
    sendMessage(topic: string, message: string) {
        console.log(`published "${message}" to "${topic}"`);
        this.mqttClient?.publish(topic, message);
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