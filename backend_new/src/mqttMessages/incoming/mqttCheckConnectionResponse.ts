import { TConnectionCheckResponse } from "../../interfaces/mqttMassge.interface";
import * as DeviceService from "../../services/deviceService";

/**
 * @description handles device connection checks and updates device service
 * @param topic mqtt topic that published the message
 * @param message message send via mqtt
 * @returns void
 */
export async function checkConnection(
    topic: string,
    message: TConnectionCheckResponse
) {
    // type checks
    if (typeof topic != "string") return;
    if(topic != process.env.MQTT_TOPIC_CHECK_CONNECTION_RESPONSE) return
    if (topic == "server") return;
    if (!message) return;
    if (message.operation != "checkConnection") return;

    const updateList: DeviceService.TUpdateDeviceProperties[] = [
        {
            _id: message.deviceID,
            propertyToChange: {
                propertyName: "isConnectedCheck",
                newValue: true,
            },
        },
        {
            _id: message.deviceID,
            propertyToChange: {
                propertyName: "isConnected",
                newValue: true,
            },
        },
    ];
    DeviceService.updateDeviceProperties(updateList);
}
