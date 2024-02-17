import { v4 as uuidv4 } from 'uuid';
import { DB_LOG, ERROR_LOG, logEvents } from "../middleware/logger";
import MqttTopicObject from "../models/mqttTopicObject";
import { COLLECTION_MQTT_TOPICS, collections, createDocument, getDocuments, updateDocument } from "./mongoDBService";
import { TMqttTopicObjectJSON_DB, TMqttTopicProperty } from '../interfaces/mqttTopicObject.interface';
import { UpdateFilter } from 'mongodb';

type MqttTopicResult = {
    isSuccessful: false
} | {
    isSuccessful: true
    mqttTopicObject: MqttTopicObject
}

export async function createNewMqttTopic(topicName: string, topicPath: string): Promise<MqttTopicResult> {
    let functionResult: MqttTopicResult = { isSuccessful: false };
    const _id = uuidv4()

    // create and insert mqtt topic
    const mqttTopic = MqttTopicObject.createNewMqttTopicObject(_id,topicName, topicPath)
    const isSuccessful = await createDocument(COLLECTION_MQTT_TOPICS,mqttTopic.getAsJson_DB())

    // check if accepted by db
    if (isSuccessful) {
        functionResult = {
            isSuccessful: true,
            mqttTopicObject: mqttTopic,
        }
    }
    else {
        functionResult = {
            isSuccessful: false,
        }
    }

    return functionResult
}

export async function getMqttTopic(_id: string): Promise<MqttTopicResult> {
    let functionResult: MqttTopicResult = { isSuccessful: false }
    let logItem = "";

    //query
    const fillter = { _id: _id }
    const findResultArr = await getDocuments<TMqttTopicObjectJSON_DB>(COLLECTION_MQTT_TOPICS,fillter)

    //validation
    if (findResultArr.length > 1) {
        let err = `Multipale documents with _id:${_id} in: mqttCollection`
        logEvents(err, DB_LOG)
        throw new Error(err)
    }
    else if (findResultArr.length == 0) {
        functionResult = { isSuccessful: false }
    }
    else {
        const queryMqttTopic = MqttTopicObject.createMqttTopicFromTDeviceJSON_DB(findResultArr[0])
        functionResult = { isSuccessful: true, mqttTopicObject: queryMqttTopic }
    }


    return functionResult
}

export async function updateMqttTopic(_id: string, propertyList: TMqttTopicProperty[]) {
    const deviceCollection = collections.mqttTopics

    //create update obj from propertyList
    const set:any = {}
    for (let index = 0; index < propertyList.length; index++) {
        const property = propertyList[index];
        set[property.propertyName] = property.newValue;
    }
    
    const updateFilter: UpdateFilter<TMqttTopicObjectJSON_DB> = {
        $set: {set}
    }

    const filter = { _id: _id }
    await updateDocument(COLLECTION_MQTT_TOPICS,filter,updateFilter);
}