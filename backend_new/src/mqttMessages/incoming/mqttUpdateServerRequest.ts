import { TUpdateDataFromDeviceRequest } from "../../interfaces/mqttMassge.interface";
import * as DeviceService from "../../services/deviceService";

/**
 * @description handles device requests to update the state of device on the server
 * @param topic mqtt topic that published the message
 * @param message message send via mqtt
 * @returns void
 */
export async function updateServer(
    topic: string,
    message: TUpdateDataFromDeviceRequest
) {
    //TODO: message doesnt need to have a type only primitive type and update based on topic
    if (typeof topic != "string") return;
    if (!message) return;
    if (message.operation != "updateServer") return;
    if (typeof message.deviceID != "string") return;
    if (typeof message.origin != "string") return;
    if (typeof message.dataID != "number") return;
    if (typeof message.typeID != "number") return;

    const update: DeviceService.TUpdateDeviceProperties = {
        _id: message.deviceID,
        propertyToChange: {
            dataID: message.dataID,
            // @ts-ignore
            typeID: message.typeID,
            propertyName: "data",
            dataPropertyName: message.dataPropertyName,
            newValue: message.newValue,
        },
    };

    await DeviceService.updateDeviceProperties([update]);
}
