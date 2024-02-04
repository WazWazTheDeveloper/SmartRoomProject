import { v4 as uuidv4 } from 'uuid';
import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";
import { TDeviceJSON_DB } from '../interfaces/device.interface';
import { TMqttTopicObjectJSON_DB } from '../interfaces/mqttTopicObject.interface';
import { DB_LOG, logEvents } from '../middleware/logger';
type TCollection = {
    devices?: mongoDB.Collection<TDeviceJSON_DB>
    mqttTopics?: mongoDB.Collection<TMqttTopicObjectJSON_DB>
}
export const collections: TCollection = {}

export async function connectToDatabase() {
    dotenv.config();
    const client: mongoDB.MongoClient = new mongoDB.MongoClient(`mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_IP}/?replicaSet=rs0` as string, {
        pkFactory: { createPk: () => uuidv4() }
    });

    await client.connect();

    // init collections and db
    const db: mongoDB.Db = client.db(process.env.DATABASE_NAME as string);
    const devices: mongoDB.Collection<TDeviceJSON_DB> = db.collection<TDeviceJSON_DB>(process.env.DATABASE_COLLECTION_DEVICE as string);
    const mqttTopics: mongoDB.Collection<TMqttTopicObjectJSON_DB> = db.collection<TMqttTopicObjectJSON_DB>(process.env.DATABASE_COLLECTION_MQTT_TOPICS as string);

    collections.devices = devices;
    collections.mqttTopics = mqttTopics;

    logEvents(`Successfully connected to database`, DB_LOG)
}