import { TAllMqttMessageType, TGetDeviceRequest, TInitDeviceRequest, } from "../interfaces/mqttMassge.interface";
import { initDevice } from "../mqttMessages/incoming/mqttInitDeviceRequest";
import { getDevice } from "../mqttMessages/incoming/mqttGetDeviceRequest";
import { checkConnection } from "../mqttMessages/incoming/mqttCheckConnectionResponse";
import { updateServerRequest } from "../mqttMessages/incoming/mqttUpdateServerRequest";
import { loggerMQTT } from "../services/loggerService";

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
    if (typeof topic != "string") return;
    if (!message) return;

    try {
        // for some reason "1" is a valid json string got JSON.parse
        // so I trigger the catch block manually 
        // maybe there will be a need to check for "true" string in the future
        if (isNumeric(message)) {
            throw "not a string"
        }

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
        loggerMQTT.warn(logItem, { uuid: "mqttRequest" })
    } catch (e) {
        if (topic == process.env.MQTT_TOPIC_CHECK_CONNECTION_RESPONSE && typeof message == "string") {
            checkConnection(topic, message);
            return;
        }
        //device update server
        if (typeof message == "string" || typeof message == "number") {
            updateServerRequest(topic, message);
            return;
        }

        //@ts-ignore
        let logItem = `unknown message: ${message}`;
        loggerMQTT.warn(logItem, { uuid: "mqttRequest" })
    }
}

function isNumeric(str : string) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(Number(str)) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}
