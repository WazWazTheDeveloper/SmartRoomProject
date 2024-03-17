import { TUpdateDataFromDeviceRequest } from "../../interfaces/mqttMassge.interface";
import MultiStateButton from "../../models/dataTypes/multiStateButtonData";
import NumberData from "../../models/dataTypes/numberData";
import SwitchData from "../../models/dataTypes/switchData";
import * as DeviceService from "../../services/deviceService";
import { getDevicesUsingTopic, getTopicIDsByPath, getTypeOfTopic, } from "../../services/mqttTopicService";

/**
 * @description handles device requests to update the state of device on the server
 * @param topic mqtt topic that published the message
 * @param message message send via mqtt
 * @returns void
 */
export async function updateServerRequest(topic: string, message: string | number) {

    const topics = await getTopicIDsByPath(topic);
    const deviceToUpdates = await getDevicesUsingTopic(topic);
    const updateList: DeviceService.TUpdateDeviceProperties[] = [];

    //check type of message
    const topicType = topics[0].topicType
    const typeOfTopic = getTypeOfTopic(topicType)
    console.log(typeOfTopic)
    if(typeOfTopic != "any") {
        if(typeof message != typeOfTopic) return
    }

    const topicIDs : string[]= []
    for (let i = 0; i < topics.length; i++) {
        const id = topics[i]._id;
        topicIDs.push(id);
    }

    for (let i = 0; i < deviceToUpdates.length; i++) {
        const device = deviceToUpdates[i];
        for (let j = 0; j < device.data.length; j++) {
            const deviceData = device.data[j];
            if (!topicIDs.includes(deviceData.mqttTopicID)) continue;
            const dataPropertyName = getDataPropertyName(deviceData.typeID);
            if (!dataPropertyName) continue;

            const update: DeviceService.TUpdateDeviceProperties = {
                _id: device._id,
                propertyToChange: {
                    dataID: deviceData.dataID,
                    // @ts-ignore
                    typeID: deviceData.typeID,
                    propertyName: "data",
                    // @ts-ignore
                    dataPropertyName: dataPropertyName,
                    newValue: message,
                },
            };
            updateList.push(update);
        }
    }

    console.log(updateList);
    await DeviceService.updateDeviceProperties(updateList);
}

function getDataPropertyName(typeID: number): string | undefined {
    switch (typeID) {
        case SwitchData.TYPE_ID:
            return "isOn";
        case NumberData.TYPE_ID:
            return "currentValue";
        case MultiStateButton.TYPE_ID:
            return "currentState";
        default:
            return undefined;
    }
}
