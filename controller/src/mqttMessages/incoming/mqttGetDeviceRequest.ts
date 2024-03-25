import { TGetDeviceRequest } from "../../interfaces/mqttMassge.interface";
import { sendDevicePropertiesMQTTRequest } from "../outgoing/mqttGetDeviceResponse";

/**
 * @description handles device powerup requests to recived data via mqtt server
 * @param topic mqtt topic that published the message
 * @param message message send via mqtt
 * @returns void
 */
export async function getDevice(topic: string, message: TGetDeviceRequest) {
    if (typeof topic != "string") return;
    if (!message) return;
    if (message.operation != "getDevice") return;
    if (typeof message.deviceID != "string") return;
    if (typeof message.origin != "string") return;

    await sendDevicePropertiesMQTTRequest(topic,message)
}
