import * as mongoDB from "mongodb";

/**
 * @description - calls sub functions that handle the mqtt topic collection changes
 * 
 * @param changeEvent - a change event form mongodb
 */
export async function mqttTopicDBHandler(changeEvent: mongoDB.ChangeStreamDocument) {
    //update devices when topic path updates
}