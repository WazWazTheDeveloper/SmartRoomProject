import * as mongoDB from "mongodb";
import * as DeviceService from "../../services/deviceService";
import * as MqttClientService from "../../services/mqttClientService";
import * as MqttTopicService from "../../services/mqttTopicService";
import SwitchData from "../../models/dataTypes/switchData";
import NumberData from "../../models/dataTypes/numberData";
import MultiStateButton from "../../models/dataTypes/multiStateButtonData";

/**
 * @description - updates device via mqtt after db is updated
 * 
 * @param changeEvent - a change event form mongodb
 * @returns 
 */
export async function onUpdateDevice(changeEvent: mongoDB.ChangeStreamDocument) {
    if(changeEvent.operationType != "update") return
    if(!changeEvent.updateDescription.updatedFields) return

    // get device to update
    const deviceResult = await DeviceService.getDevice(String(changeEvent.documentKey._id))
    if(!deviceResult.isSuccessful) return
    const curDevice = deviceResult.device

    // get data to update
    const updatedFieldKeys = Object.keys(changeEvent.updateDescription.updatedFields)

    for (let i = 0; i < updatedFieldKeys.length; i++) {
        const key = updatedFieldKeys[i];
        const keyVals:string[] = key.split(".")
        if(keyVals[0] == "data") {
            const at = Number(keyVals[1]) //place at data array
            const typeID = curDevice.data[at].typeID; //get type of data
            const dataPropertyName = getDataPropertyName(typeID) //get propertyname to update
            if(keyVals[2] != dataPropertyName) continue

            //get topic
            const topicID = curDevice.data[at].mqttPrimeryTopicID;
            const topicResult = await MqttTopicService.getMqttTopic(topicID)
            if(!topicResult.isSuccessful) continue
            const topic = topicResult.mqttTopicObject.path


            // get data
            //@ts-ignore
            const data:string | number = curDevice.data[at][dataPropertyName]

            MqttClientService.publishMessage(topic,data)
        }
        // TODO: add device 
    }
}

function getDataPropertyName(typeID: number) {
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
