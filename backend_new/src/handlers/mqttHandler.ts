import {
    TAllMqttMessageType,
    TConnectionCheckResponse,
    TGetDeviceRequest,
    TInitDeviceRequest,
    TUpdateDataFromDeviceRequest,
    TUpdateDataToDeviceResponse,
} from "../interfaces/mqttMassge.interface";
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
    message: TAllMqttMessageType
) {
    console.log(topic);
    console.log(message);
    if (typeof topic != "string") return;
    if (!message) return;

    if(typeof message == "string" || typeof message == "number") {
        updateServerRequest(topic,message);
        return
    }

    if (message.origin == "server") return;

    if (message.operation == "initDevice") {
        initDevice(topic, message as TInitDeviceRequest);
        return;
    }
    if (message.operation == "getDevice") {
        getDevice(topic, message as TGetDeviceRequest);
        return;
    }

    if (topic == process.env.MQTT_TOPIC_INIT_DEVICE) return;

    if (message.operation == "checkConnection") {
        checkConnection(topic, message as TConnectionCheckResponse);
        return;
    }

    if (topic == process.env.MQTT_TOPIC_CHECK_CONNECTION_RESPONSE) return;

    switch (message.operation) {
        case "updateDevice":
            updateDevice(topic, message as TUpdateDataToDeviceResponse);
            break;
        // case "updateServer":
        //     updateServer(topic, message as TUpdateDataFromDeviceRequest);
        //     break;
        default:
            //@ts-ignore
            let logItem = `unknown operation: ${message.operation}`;
            logEvents(logItem, MQTT_LOG);
    }
}

// I dont think this i necessary
async function updateDevice(
    topic: string,
    message: TUpdateDataToDeviceResponse
) {
    if (typeof topic != "string") return;
    if (!message) return;
    if (message.operation != "updateDevice") return;
}
