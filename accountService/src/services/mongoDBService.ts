import * as mongoDB from "mongodb";
import { v4 as uuidv4 } from 'uuid';
import { TUser } from "../interfaces/user.interface";
import { TPermissionGroup } from "../interfaces/permissionGroup.interface";
import { loggerDB } from "./loggerService";
import { getRequestUUID } from "../middleware/requestID";

type TCollection = {
    users?: mongoDB.Collection<TUser>
    permissionGroups?: mongoDB.Collection<TPermissionGroup>
}

type collectionNames = "users" | "permissionGroups"

export type JSONDBTypes = TUser | TPermissionGroup

type collectionTypes =
    mongoDB.Collection<TUser> |
    mongoDB.Collection<TPermissionGroup>

const database = {
    client: new mongoDB.MongoClient(`mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_IP}/?replicaSet=rs0` as string, {
        pkFactory: { createPk: () => uuidv4() }
    }),
    isConnected: false,
    isConnecting: false
}


export const collections: TCollection = {}

/**
 * setup connection to database and auto reconnect
 */
export async function connectToDatabase() {
    database.client.on("open", () => {
        database.isConnecting = false;
        database.isConnected = true
        loggerDB.info("Successfully connected to users database")
        // init collections and db
        const db: mongoDB.Db = database.client.db(process.env.DATABASE_NAME as string);
        const users: mongoDB.Collection<TUser> = db.collection<TUser>(process.env.DATABASE_COLLECTION_USERS as string);
        const permissionGroups: mongoDB.Collection<TPermissionGroup> = db.collection<TPermissionGroup>(process.env.DATABASE_COLLECTION_PERMISSION_GROUPS as string);

        collections.users = users
        collections.permissionGroups = permissionGroups

        users.createIndex({ username: 1 }, { unique: true });
    })

    database.client.on("serverHeartbeatFailed", () => {
        if (database.isConnecting) return

        database.isConnected = false
        loggerDB.error("connection to database closed attempting to reconnect in 5 secends")
        setTimeout(async () => {
            attemptToConnect()
        }, 5000)
    })

    await attemptToConnect()
}

/**
 * attempt to connect to database
 */
async function attemptToConnect() {
    if (database.isConnecting) return

    try {
        database.isConnecting = true;
        loggerDB.info("attempting to connect to database")
        await database.client.connect();
    } catch (e) {
        database.isConnecting = false;
        loggerDB.error(`error connecting to database: ${e}, attempting to reconnect in 5 secends`)
        setTimeout(async () => {
            attemptToConnect()
        }, 5000)
    }
}

/**
 * crate a new dockument in a specific collection in the database
 * @param collectionStr name of collection in the database
 * @param documentJSON object to push to the collection
 * @returns boolean promiss if done successfully
 */
export async function createDocument(collectionStr: collectionNames, documentJSON: any) {
    let isSuccessful = false;
    let logItem = "";

    //check if database is connected
    if (!database.isConnected) {
        return isSuccessful
    }

    // check if db collection exist
    let collection: collectionTypes | undefined = collections[collectionStr]
    if (!collection) {
        const err = "no collection found \tat mongoDBService.ts \tat createDocument"
        loggerDB.error(err)
        throw new Error(err)
    }

    try {
        const insertResult = await collection?.insertOne(documentJSON);

        // check if accepted by db
        if (insertResult.acknowledged) {
            logItem = `Inserted new document with _id: ${insertResult.insertedId} to ${collection.namespace}: \n${JSON.stringify(documentJSON, null, "\t")}`
            isSuccessful = true
            loggerDB.verbose(logItem, { uuid: getRequestUUID() })
        }
        else {
            logItem = `Failed to insert document with the _id: ${insertResult.insertedId} to ${collection.namespace}\t
            ${JSON.stringify(documentJSON, null, "\t")}`
            loggerDB.error(logItem, { uuid: getRequestUUID() })
            isSuccessful = false
        }

        return isSuccessful
    } catch (e) {
        logItem = `Failed to insert document to database`
        loggerDB.error(logItem, { uuid: getRequestUUID() })
        return isSuccessful;
    }
}

/**
 * get documents from collection with basic quarry
 * @param collectionStr name of collection in the database
 * @param fillter mongoDB.Filter<any> object to fillter collection
 * @param project object that specify what fields to project from quarry
 * @returns array with documents
 */
export async function getDocuments<DocumentType>(collectionStr: collectionNames, fillter: mongoDB.Filter<any>, project: any = {}) {
    let logItem = "";

    if (!database.isConnected) {
        return []
    }

    // check if db collection exist
    let collection: collectionTypes | undefined = collections[collectionStr]
    if (!collection) {
        const err = "no collection found at mongoDBService.ts at getDocuments"
        loggerDB.error(err, { uuid: getRequestUUID() });
        throw new Error(err)
    }

    try {
        //query
        const findResult = collection.find(fillter).project(project)
        const findResultArr = await findResult.toArray() as DocumentType[];

        // log
        logItem = `Search with fillter:${JSON.stringify(fillter)} returned ${findResultArr.length} documents from: ${collection.namespace}`;
        loggerDB.verbose(logItem, { uuid: getRequestUUID() })

        return findResultArr
    } catch (e) {
        logItem = `Failed to find document in database`
        loggerDB.error(logItem, { uuid: getRequestUUID() })
        return [];
    }
}

/**
 * update one document in a collection
 * @param collectionStr name of collection in the database
 * @param fillter mongoDB.Filter<any> object to fillter collection
 * @param updateFilter object that specify what fields to update
 * @returns boolean promiss if done successfully
 */
export async function updateDocument(collectionStr: collectionNames, fillter: mongoDB.Filter<JSONDBTypes>, updateFilter: mongoDB.UpdateFilter<collectionTypes>) {
    let logItem = "";

    if (!database.isConnected) {
        const err = "not conencted to db"
        loggerDB.error(err, { uuid: getRequestUUID() });
        throw new Error(err)
    }

    // check if db collection exist
    let collection: collectionTypes | undefined = collections[collectionStr]
    if (!collection) {
        const err = "no collection found at mongoDBService.ts at updateDocument"
        loggerDB.error(err, { uuid: getRequestUUID() });
        throw new Error(err)
    }

    try {
        // db update
        const updateResult = await collection.updateOne(fillter, updateFilter)

        //check if accepted by db and return
        if (updateResult.acknowledged) {
            logItem = `Modified ${updateResult.modifiedCount} documents at:${collection.namespace} with: \n${JSON.stringify(updateFilter, null, "\t")}`
            // logEvents(logItem, DB_LOG)
            return true
        }
        else {
            logItem = `Failed to update document with filter:${fillter} to ${collection.namespace}\t
        ${JSON.stringify(updateFilter, null, "\t")}`
            // logEvents(logItem, DB_LOG)
            return false
        }
    } catch (e) {
        logItem = `Failed to find document in database`
        loggerDB.error(logItem, { uuid: getRequestUUID() })
        return false;
    }
}

type TOperation = mongoDB.AnyBulkWriteOperation<TUser>[] | mongoDB.AnyBulkWriteOperation<TPermissionGroup>[]
/**
 * bulk write to collection
 * @param collectionStr name of collection in the database
 * @param operations An array of bulkwrite() operations
 * @param options An object of BulkWriteOptions object
 * @returns boolean promiss if done successfully
 */
export async function bulkWriteCollection(collectionStr: collectionNames, operations: TOperation, options?: mongoDB.BulkWriteOptions) {
    let logItem = "";

    //check if database is connected
    if (!database.isConnected) {
        const err = `not connected to database`
        loggerDB.error(err, { uuid: getRequestUUID() })
        throw new Error(err)
    }

    // check if db collection exist
    let collection: collectionTypes | undefined = collections[collectionStr]
    if (!collection) {
        const err = "no collection found \tat mongoDBService.ts \tat updateDocument"
        loggerDB.error(err, { uuid: getRequestUUID() });
        throw new Error(err)
    }

    try {
        //@ts-ignore
        const bulkWriteResult: mongoDB.BulkWriteResult = await collection.bulkWrite(operations, options)
        logItem = `Inserted ${bulkWriteResult.insertedCount}, Modified ${bulkWriteResult.modifiedCount}, Deleted ${bulkWriteResult.deletedCount} documents at:${collection.namespace} with: \n
            ${JSON.stringify(operations, null, "\t")}`
        loggerDB.verbose(`failed bulkWrite to:${logItem}`, { uuid: getRequestUUID() })
        return true
    } catch (e) {
        const err = `failed to bulkWrite :${e}`
        loggerDB.error(err, { uuid: getRequestUUID() })
        throw new Error(err)
    }
}

/**
 * get documents from a collection using an aggregation pipeline
 * @param collectionStr name of collection in the database
 * @param aggregation An aggregation pipeline
 * @returns An array containing documents from the database
 */
export async function getDocumentsAggregate<DocumentType>(collectionStr: collectionNames, aggregation: any[]) {
    let logItem = "";

    //check if database is connected
    if (!database.isConnected) {
        const err = `not connected to database`
        loggerDB.error(err, { uuid: getRequestUUID() })
        throw new Error(err)
    }

    // check if db collection exist
    let collection: collectionTypes | undefined = collections[collectionStr]
    if (!collection) {
        const err = "no collection found \tat mongoDBService.ts \tat updateDocument"
        loggerDB.error(err, { uuid: getRequestUUID() });
        throw new Error(err)
    }

    //query
    try {
        const findResult = collection.aggregate(aggregation)
        const findResultArr = await findResult.toArray() as DocumentType[];
        logItem = `Search with aggregation:${JSON.stringify(aggregation, null, "\t")} returned ${findResultArr.length} documents from: ${collection.namespace}`;
        loggerDB.verbose(logItem, { uuid: getRequestUUID() });

        return findResultArr
    } catch (e) {
        const err = `failed to agregate :${e}`
        loggerDB.error(err, { uuid: getRequestUUID() })
        throw new Error(err)
    }
}

/**
 * update one document in a collection
 * @param collectionStr name of collection in the database
 * @param fillter mongoDB.Filter<any> object to fillter collection
 * @returns boolean promiss if done successfully
 */
export async function deleteDocument(collectionStr: collectionNames, filter: mongoDB.Filter<any>) {
    let logItem = "";

    // check if db collection exist
    let collection: collectionTypes | undefined = collections[collectionStr]
    if (!collection) {
        const err = "no collection found \tat mongoDBService.ts \tat updateDocument"
        loggerDB.error(err, { uuid: getRequestUUID() })
        throw new Error(err)
    }

    // create and insert mqtt topic
    const deleteResult = await collection?.deleteOne(filter);

    // check if accepted by db
    if (deleteResult.acknowledged) {
        logItem = `Deleted ${deleteResult.deletedCount} documents from: ${collection.namespace} with filter: \n${JSON.stringify(filter, null, "\t")}`
        loggerDB.verbose(logItem, { uuid: getRequestUUID() })
        return true
    }
    else {
        logItem = `Failed to delete documents from: ${collection.namespace} with filter: \n${JSON.stringify(filter, null, "\t")}`
        loggerDB.error(logItem, { uuid: getRequestUUID() })
        return false
    }
}