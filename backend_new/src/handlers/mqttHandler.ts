import { TAllMqttMessageType, TConnectionCheckResponse, TGetDeviceRequest, TInitDeviceRequest, } from "../interfaces/mqttMassge.interface";
import { MQTT_LOG, logEvents } from "../middleware/logger";
import { initDevice } from "../mqttMessages/incoming/mqttInitDeviceRequest";
import { getDevice } from "../mqttMessages/incoming/mqttGetDeviceRequest";
import { checkConnection } from "../mqttMessages/incoming/mqttCheckConnectionResponse";
import { updateServerRequest } from "../mqttMessages/incoming/mqttUpdateServerRequest";

/**
 * @description supposed to be called by the mqtt client when a message is recived and routes the message to the correct funciton
 * @param topic mqtt topic that published the message
 * @param message message send via mqtt
 * @returns void
 */
export function mqttMessageHandler(
    topic: string,
    message: string
) {
    console.log(topic)
    console.log(message)
    if (typeof topic != "string") return;
    if (!message) return;

    try {
        let messageJson: TAllMqttMessageType = JSON.parse(message.toString());

        if (messageJson.origin == "server") return;
        if (messageJson.operation == "initDevice") {
            initDevice(topic, messageJson as TInitDeviceRequest);
            return;
        }
        if (messageJson.operation == "getDevice") {
            getDevice(topic, messageJson as TGetDeviceRequest);
            return;
        }

        //@ts-ignore
        let logItem = `unknown operation: ${message.operation}`;
        logEvents(logItem, MQTT_LOG);
    } catch (e) {
        if (topic == process.env.MQTT_TOPIC_CHECK_CONNECTION_RESPONSE) {
            checkConnection(topic, message);
            return;
        }
        //device update server
        if (typeof message == "string" || typeof message == "number") {
            updateServerRequest(topic, message);
            return;
        }

        //@ts-ignore
        let logItem = `unknown operation: ${message}`;
        logEvents(logItem, MQTT_LOG);
    }
}
