import * as mongoDB from "mongodb";

/**
 * @description - handle the mqtt topic collection changes
 * 
 * @param changeEvent - a change event form mongodb
 */
export async function mqttTopicDBHandler(changeEvent: mongoDB.ChangeStreamDocument) {
    //TODO: update devices when topic path updates
}