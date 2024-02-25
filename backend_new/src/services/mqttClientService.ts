import mqtt from 'mqtt'
import { MQTT_LOG, logEvents, logger } from '../middleware/logger';
import { TAllMqttMessageType } from '../interfaces/mqttMassge.interface';

let mqttClient: mqtt.MqttClient
let subscribes: string[] = ["initDevice"]
let isReconnectInterval = false;
let reconnectInterval: NodeJS.Timeout

export function initializeMqttClient(mqttMessageHandler: (topic: string, message: TAllMqttMessageType) => void) {
    mqttClient = mqtt.connect(`mqtt://${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`, { username: process.env.MQTT_USERNAME, password: process.env.MQTT_PASSWORD });

    mqttClient.on('error', (err) => {
        logEvents(err, MQTT_LOG)
    });

    mqttClient.on("connect", () => {
        let log = `connected to "mqtt://${process.env.MQTT_HOST}:${process.env.MQTT_PORT}" successfully`
        logEvents(log, MQTT_LOG)
        for (let i = 0; i < subscribes.length; i++) {
            const subscribesPath = subscribes[i];
            mqttClient.subscribe(subscribesPath, (err) => {
                if (err) {
                    logEvents(err, MQTT_LOG)
                } else {
                    let logItem = `subscribed to ${subscribesPath} successfully`
                    logEvents(logItem, MQTT_LOG)
                }
            })
        }
    })

    mqttClient.on('close', () => {
        let logItem = `connection to "mqtt://${process.env.MQTT_HOST}:${process.env.MQTT_PORT}" closed`
        logEvents(logItem, MQTT_LOG)

        if (!isReconnectInterval) {
            isReconnectInterval = true;
            reconnectInterval = setInterval(() => {
                if (mqttClient.connected) {
                    clearInterval(reconnectInterval)
                    isReconnectInterval = false;
                    return
                }
                let logItem = `attempting to reconnect to "mqtt://${process.env.MQTT_HOST}:${process.env.MQTT_PORT}" closed`
                logEvents(logItem, MQTT_LOG)
                mqttClient.reconnect()
            }, 5000)
        }

    });

    mqttClient.on("message", (topic: string, message: Buffer) => {
        let messageJson = JSON.parse(message.toString())
        let logItem = `recived massage from topic ${topic}:\t
                                ${JSON.stringify(messageJson, null, "\t")}`
        logEvents(logItem, MQTT_LOG)
        mqttMessageHandler(topic, messageJson)
    })

}

export function subscribeToTopic(mqttTopicPath: string) {
    if (!mqttClient.connected) return false

    mqttClient.subscribe(mqttTopicPath)
    subscribes.push(mqttTopicPath);
    console.log(subscribes)
    return true
}

export function unsubscribeFromTopic(mqttTopicPath: string) {
    if (!mqttClient.connected) return false

    mqttClient.unsubscribe(mqttTopicPath)
    subscribes = subscribes.filter((e) => e != mqttTopicPath)

    return true
}

export function publishMessage(topic: string, message: TAllMqttMessageType) {
    mqttClient.publish(topic, JSON.stringify(message))
    let logItem = `published massage to topic ${topic}:\t
                            ${JSON.stringify(message, null, "\t")}`
    logEvents(logItem, MQTT_LOG)
}