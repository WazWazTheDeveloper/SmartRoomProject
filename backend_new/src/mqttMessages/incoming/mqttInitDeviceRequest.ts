import { TInitDeviceRequest, TInitDeviceRespone } from "../../interfaces/mqttMassge.interface";
import * as DeviceService from "../../services/deviceService";
import { publishMessage } from "../../services/mqttClientService";

/**
 * @description handles device initialization requests recived via mqtt server
 * @param topic mqtt topic that published the message
 * @param message message send via mqtt
 * @returns void
 */
export async function initDevice(topic: string, message: TInitDeviceRequest) {
    if (typeof topic != "string") return;
    if (topic != (process.env.MQTT_TOPIC_INIT_DEVICE as string)) return; //init device should only be called on initDevice topic
    if (!message) return;
    if (message.operation != "initDevice") return;
    if (typeof message.origin != "string") return;
    if (!Array.isArray(message.dataTypeArray)) return;
    for (let i = 0; i < message.dataTypeArray.length; i++) {
        const element = message.dataTypeArray[i];
        if (typeof element.dataID != "number") return;
        if (typeof element.typeID != "number") return;
    }

    let deviceName = "new device";
    if (typeof message.deviceName == "string") {
        deviceName = message.deviceName;
    }

    let result = await DeviceService.createDevice(
        deviceName,
        message.dataTypeArray
    );
    
    // TODO: move this part to oncreatehandler
    if (result.isSuccessful) {
        const response: TInitDeviceRespone = {
            isSuccessful: true,
            operation: "initDevice",
            origin: "server",
            target: message.origin,
            _id: result.device._id,
        };
        publishMessage(topic, response);
    } else {
        const response: TInitDeviceRespone = {
            isSuccessful: false,
            operation: "initDevice",
            origin: "server",
            target: message.origin,
        };
        publishMessage(topic, response);
    }
}