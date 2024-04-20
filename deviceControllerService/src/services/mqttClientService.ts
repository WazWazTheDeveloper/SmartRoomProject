import mqtt from "mqtt";
// import { MQTT_LOG, logEvents} from "../middleware/logger";
import { TAllMqttMessageType } from "../interfaces/mqttMassge.interface";
import { loggerMQTT } from "./loggerService";

let mqttClient: mqtt.MqttClient;
export let subscribes: string[] = [
    process.env.MQTT_TOPIC_INIT_DEVICE as string,
    process.env.MQTT_TOPIC_CHECK_CONNECTION_RESPONSE as string,
    process.env.MQTT_TOPIC_GET_DATA as string,
];
let isReconnectInterval = false;
let reconnectInterval: NodeJS.Timeout;

export function initializeMqttClient(
    mqttMessageHandler: (topic: string, message: string) => void
) {
    mqttClient = mqtt.connect(
        `mqtt://${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`,
        {
            username: process.env.MQTT_USERNAME,
            password: process.env.MQTT_PASSWORD,
        }
    );

    mqttClient.on("error", (err) => {
        loggerMQTT.error(String(err), { uuid: "mqtt-connection" });
    });

    mqttClient.on("connect", () => {
        let log = `connected to "mqtt://${process.env.MQTT_HOST}:${process.env.MQTT_PORT}" successfully`;
        loggerMQTT.info(log, { uuid: "mqtt-connection" });
        for (let i = 0; i < subscribes.length; i++) {
            const subscribesPath = subscribes[i];
            mqttClient.subscribe(subscribesPath, (err) => {
                if (err) {
                    loggerMQTT.error(log, { uuid: "mqtt-connection" });
                } else {
                    let logItem = `subscribed to ${subscribesPath} successfully`;
                    loggerMQTT.info(logItem, { uuid: "mqtt-connection" });
                }
            });
        }
    });

    mqttClient.on("close", () => {
        let logItem = `connection to "mqtt://${process.env.MQTT_HOST}:${process.env.MQTT_PORT}" closed`;
        loggerMQTT.info(logItem, { uuid: "mqtt-connection" });

        if (!isReconnectInterval) {
            isReconnectInterval = true;
            reconnectInterval = setInterval(() => {
                if (mqttClient.connected) {
                    clearInterval(reconnectInterval);
                    isReconnectInterval = false;
                    return;
                }
                const logItem = `attempting to reconnect to "mqtt://${process.env.MQTT_HOST}:${process.env.MQTT_PORT}" closed`;
                loggerMQTT.info(logItem, { uuid: "mqtt-connection" });
                mqttClient.reconnect();
            }, 5000);
        }
    });

    mqttClient.on("message", (topic: string, message: Buffer) => {
        try {
            let messageString = message.toString()
            // let messageJson = JSON.parse(message.toString());
            let logItem = `recived massage from topic ${topic}:\t
                                    ${messageString}`;
            loggerMQTT.verbose(logItem, { uuid: "mqtt-message-receive" });
            mqttMessageHandler(topic, messageString);
        } catch (e) {
            let logItem = `error: ${e} in massage from topic ${topic}:\t
            ${message}`;
            loggerMQTT.error(logItem, { uuid: "mqtt-message-receive" });
        }
    });
}

export function subscribeToTopic(mqttTopicPath: string) {
    subscribes.push(mqttTopicPath);

    if (!mqttClient.connected) return false;
    mqttClient.subscribe(mqttTopicPath, (err) => {
        if (err) {
            loggerMQTT.error(String(err), { uuid: "mqtt-subscription" });
        } else {
            let logItem = `subscribed to ${mqttTopicPath} successfully`;
            loggerMQTT.info(logItem, { uuid: "mqtt-subscription" });
        }
    });
    return true;
}

export function unsubscribeFromTopic(mqttTopicPath: string) {
    if (!mqttClient.connected) return false;

    mqttClient.unsubscribe(mqttTopicPath);
    subscribes = subscribes.filter((e) => e != mqttTopicPath);

    return true;
}

export function publishMessage(topic: string, message: TAllMqttMessageType | string | number) {
    // add a check to check if type of message is correct for that type of topic
    mqttClient.publish(topic, JSON.stringify(message));
    let logItem = `published massage to topic ${topic}:\t
                            ${JSON.stringify(message, null, "\t")}`;
    loggerMQTT.verbose(logItem, { uuid: "mqtt-message-send" });
}
