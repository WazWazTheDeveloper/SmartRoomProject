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
export async function updateServerRequest(topic: string, message: string) {

    const topics = await getTopicIDsByPath(topic);
    const deviceToUpdates = await getDevicesUsingTopic(topic);
    const updateList: DeviceService.TUpdateDeviceProperties[] = [];

    //check type of message
    const topicType = topics[0].topicType
    const typeOfTopic = getTypeOfTopic(topicType)
    console.log(typeOfTopic)

    let messageData: string | number | boolean = message;

    if (typeOfTopic == "number" && isNumeric(message)) {
        messageData = Number(message);
    }
    else if (typeOfTopic == "boolean" && isNumberABoolean(message)) {
        messageData = Number(message) == 1 ? true : false
    } else if (typeOfTopic == "boolean" && (String(message).toLowerCase() === 'true' || String(message).toLowerCase() === 'false')) {
        messageData = String(message).toLowerCase() == "true" ? true : false
    } else {
        return;
    }

    const topicIDs: string[] = []
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
                    newValue: messageData,
                },
            };
            updateList.push(update);
        }
    }

    // this can return an error for debugging!
    let TUpdateDeviceReturn = await DeviceService.updateDeviceProperties(updateList);
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

function isNumeric(str: string) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(Number(str)) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

function isNumberABoolean(str: string) {
    if (!isNumeric(str)) return false
    let number = Number(str);
    if (!(number == 0 || number == 1)) return false;
    return true;
}