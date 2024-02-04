import { promises } from "dns";
import { DB_LOG, ERROR_LOG, logEvents } from "../middleware/logger";
import MqttTopicObject from "../models/mqttTopicObject";
import { collections } from "./mongoDBService";

type createNewMqttTopicResult = {
    isSuccessful: false
} | {
    isSuccessful: true
    mqttTopicObject: MqttTopicObject
}

export async function createNewMqttTopic(topicName: string, topicPath: string): Promise<createNewMqttTopicResult> {
    let functionResult: createNewMqttTopicResult
    let logItem = "";

    const mqttCollection = collections.mqttTopics
    if (!mqttCollection) {
        const err = "no collection found mqttTopics at mqttTopicService.ts line:7"
        logEvents(err, ERROR_LOG)
        throw new Error(err)
    }

    const mqttTopic = new MqttTopicObject(topicName, topicPath)

    const insertResult = await mqttCollection?.insertOne(mqttTopic.getAsJson_DB());

    if (insertResult.acknowledged) {
        logItem = `A document type "MqttTopicObject" was inserted with the _id: ${insertResult.insertedId} to ${mqttCollection.namespace}`
        functionResult = {
            isSuccessful: true,
            mqttTopicObject: mqttTopic,
        }
    }
    else {
        logItem = `Failed to insert document of type "MqttTopicObject" with the _id: ${insertResult.insertedId} to ${mqttCollection.namespace}\t
        ${JSON.stringify(mqttTopic.getAsJson(), null, "\t")}`
        functionResult = {
            isSuccessful: false,
        }
    }

    logEvents(logItem, DB_LOG)
    return functionResult
}
