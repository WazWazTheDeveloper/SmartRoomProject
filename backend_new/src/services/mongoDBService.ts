import { v4 as uuidv4 } from 'uuid';
import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";
import { TDeviceJSON_DB } from '../interfaces/device.interface';
import { TMqttTopicObjectJSON_DB } from '../interfaces/mqttTopicObject.interface';
import { DB_LOG , logEvents } from '../middleware/logger';
import { TTaskJSON_DB } from '../interfaces/task.interface';
type TCollection = {
    devices?: mongoDB.Collection<TDeviceJSON_DB>
    mqttTopics?: mongoDB.Collection<TMqttTopicObjectJSON_DB>
    tasks?: mongoDB.Collection<TTaskJSON_DB>
}
type collectionTypes =
    mongoDB.Collection<TDeviceJSON_DB> |
    mongoDB.Collection<TMqttTopicObjectJSON_DB> |
    mongoDB.Collection<TTaskJSON_DB>

type JSONDBTypes = TDeviceJSON_DB | TMqttTopicObjectJSON_DB | TTaskJSON_DB

type collectionNames = "devices" | "mqttTopics" | "tasks"

export const COLLECTION_DEVICES = 'devices'
export const COLLECTION_MQTT_TOPICS = 'mqttTopics'
export const COLLECTION_TASKS = 'tasks'

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
    const tasks: mongoDB.Collection<TTaskJSON_DB> = db.collection<TTaskJSON_DB>(process.env.DATABASE_COLLECTION_TASKS as string);

    collections.devices = devices;
    collections.mqttTopics = mqttTopics;
    collections.tasks = tasks;

    logEvents(`Successfully connected to database`, DB_LOG)
}

export async function updateDocument(collectionStr: collectionNames, fillter: mongoDB.Filter<JSONDBTypes>, updateFilter: mongoDB.UpdateFilter<collectionTypes>) {
    let logItem = "";

    // check if db collection exist
    let collection: collectionTypes | undefined = collections[collectionStr]
    if (!collection) {
        const err = "no collection found \tat mongoDBService.ts \tat updateDocument"
        logEvents(err, DB_LOG)
        throw new Error(err)
    }

    // db update
    const updateResult = await collection.updateOne(fillter, updateFilter)
    // console.log(updateResult)

    //check if accepted by db and return
    if (updateResult.acknowledged) {
        logItem = `Modified ${updateResult.modifiedCount} documents at:${collection.namespace} with: \n${JSON.stringify(updateFilter, null, "\t")}`
        logEvents(logItem, DB_LOG)
        return true
    }
    else {
        logItem = `Failed to update document with filter:${fillter} to ${collection.namespace}\t
        ${JSON.stringify(updateFilter, null, "\t")}`
        logEvents(logItem, DB_LOG)
        return false
    }
}

export async function updateDocuments(collectionStr: collectionNames, fillter: mongoDB.Filter<JSONDBTypes>, updateFilter: mongoDB.UpdateFilter<collectionTypes>) {
    let logItem = "";

    // check if db collection exist
    let collection: collectionTypes | undefined = collections[collectionStr]
    if (!collection) {
        const err = "no collection found \tat mongoDBService.ts \tat updateDocument"
        logEvents(err, DB_LOG)
        throw new Error(err)
    }

    // db update
    const updateResult = await collection.updateMany(fillter, updateFilter)

    //check if accepted by db and return
    if (updateResult.acknowledged) {
        logItem = `Modified ${updateResult.modifiedCount} documents at:${collection.namespace} with: \n${JSON.stringify(updateFilter, null, "\t")}`
        logEvents(logItem, DB_LOG)
        return true
    }
    else {
        logItem = `Failed to update document with filter:${fillter} to ${collection.namespace}\t
        ${JSON.stringify(updateFilter, null, "\t")}`
        logEvents(logItem, DB_LOG)
        return false
    }
}

export async function bulkWriteCollection(collectionStr: collectionNames, operations:mongoDB.AnyBulkWriteOperation<JSONDBTypes>[]) {
    let logItem = "";

    // check if db collection exist
    let collection: collectionTypes | undefined = collections[collectionStr]
    if (!collection) {
        const err = "no collection found \tat mongoDBService.ts \tat updateDocument"
        logEvents(err, DB_LOG)
        throw new Error(err)
    }

    // collection.bulkWrite(operations)
}

export async function createDocument(collectionStr: collectionNames, documentJSON: any) {
    let isSuccessful = false;
    const _id = uuidv4()
    let logItem = "";

    // check if db collection exist
    let collection: collectionTypes | undefined = collections[collectionStr]
    if (!collection) {
        const err = "no collection found \tat mongoDBService.ts \tat updateDocument"
        logEvents(err, DB_LOG)
        throw new Error(err)
    }

    // create and insert mqtt topic
    const insertResult = await collection?.insertOne(documentJSON);

    // check if accepted by db
    if (insertResult.acknowledged) {
        logItem = `Inserted new document with _id: ${insertResult.insertedId} to ${collection.namespace}: \n${JSON.stringify(documentJSON, null, "\t")}`
        isSuccessful = true
    }
    else {
        logItem = `Failed to insert document with the _id: ${insertResult.insertedId} to ${collection.namespace}\t
        ${JSON.stringify(documentJSON, null, "\t")}`
        isSuccessful = false

    }

    logEvents(logItem, DB_LOG)
    return isSuccessful
}

export async function getDocuments<DocumentType>(collectionStr: collectionNames, fillter: mongoDB.Filter<any>,project:any = {}) {
    let logItem = "";

    // check if db collection exist
    let collection: collectionTypes | undefined = collections[collectionStr]
    if (!collection) {
        const err = "no collection found \tat mongoDBService.ts \tat updateDocument"
        logEvents(err, DB_LOG)
        throw new Error(err)
    }

    //query
    const findResult = collection.find(fillter).project(project)
    const findResultArr = await findResult.toArray() as DocumentType[];

    // log
    logItem = `Search with fillter:${JSON.stringify(fillter)} returned ${findResultArr.length} documents from: ${collection.namespace}`;
    logEvents(logItem, DB_LOG)


    return findResultArr
}

export async function getDocumentsAggregate<DocumentType>(collectionStr: collectionNames, aggregation: any[]) {
    let logItem = "";

    // check if db collection exist
    let collection: collectionTypes | undefined = collections[collectionStr]
    if (!collection) {
        const err = "no collection found \tat mongoDBService.ts \tat updateDocument"
        logEvents(err, DB_LOG)
        throw new Error(err)
    }

    //query
    const findResult = collection.aggregate(aggregation)
    const findResultArr = await findResult.toArray() as DocumentType[];

    // log
    logItem = `Search with aggregation:${JSON.stringify(aggregation)} returned ${findResultArr.length} documents from: ${collection.namespace}`;
    logEvents(logItem, DB_LOG)


    return findResultArr
}

export async function getCollection(collectionStr: collectionNames) {
    // check if db collection exist
    let collection: collectionTypes | undefined = collections[collectionStr]
    if (!collection) {
        const err = "no collection found \tat mongoDBService.ts \tat updateDocument"
        logEvents(err, DB_LOG)
        throw new Error(err)
    }

    return collection;
}

export async function deleteDocuments(collectionStr: collectionNames, filter: mongoDB.Filter<any>) {
    let logItem = "";

    // check if db collection exist
    let collection: collectionTypes | undefined = collections[collectionStr]
    if (!collection) {
        const err = "no collection found \tat mongoDBService.ts \tat updateDocument"
        logEvents(err, DB_LOG)
        throw new Error(err)
    }

    // create and insert mqtt topic
    const deleteResult = await collection?.deleteOne(filter);

    // check if accepted by db
    if (deleteResult.acknowledged) {
        logItem = `Deleted ${deleteResult.deletedCount} documents from: ${collection.namespace} with filter: \n${JSON.stringify(filter, null, "\t")}`
    }
    else {
        logItem = `Failed to delete documents from: ${collection.namespace} with filter: \n${JSON.stringify(filter, null, "\t")}`

    }

    logEvents(logItem, DB_LOG)
}