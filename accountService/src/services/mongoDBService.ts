import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";
import { v4 as uuidv4 } from 'uuid';
import { TUser } from "../interfaces/user.interface";
import { TPermissionGroup } from "../interfaces/permissionGroup.interface";
import { loggerDB } from "./loggerService";
import { error } from "console";
import { cli } from "winston/lib/winston/config";

const database = {
    client: new mongoDB.MongoClient(`mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_IP}/?replicaSet=rs0` as string, {
        pkFactory: { createPk: () => uuidv4() }
    }),
    isConnected: false,
    isConnecting: false
}

type TCollection = {
    users?: mongoDB.Collection<TUser>
    permissionGroups?: mongoDB.Collection<TPermissionGroup>
}

type collectionNames = "users" | "permissionGroups"

type collectionTypes =
    mongoDB.Collection<TUser> |
    mongoDB.Collection<TPermissionGroup>

export const collections: TCollection = {}

// const client: mongoDB.MongoClient = new mongoDB.MongoClient(`mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_IP}/?replicaSet=rs0` as string, {
//     pkFactory: { createPk: () => uuidv4() }
// });

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
    })

    database.client.on("serverHeartbeatFailed", () => {
        if (database.isConnecting) return

        database.isConnected = false
        loggerDB.error("connection to database closed attempting to reconnect in 5 secends")
        setTimeout(async () => {
            attemptConnecting()
        }, 5000)
    })

    await attemptConnecting()
}

async function attemptConnecting() {
    if (database.isConnecting) return

    try {
        database.isConnecting = true;
        loggerDB.error("attempting to connect to database")
        await database.client.connect();
    } catch (e) {
        database.isConnecting = false;
        loggerDB.warn(`error connecting to database: ${e}, attempting to reconnect in 5 secends`)
        setTimeout(async () => {
            attemptConnecting()
        }, 5000)
    }
}

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

    console.log("boop");

    // create and insert mqtt topic
    try {
        const insertResult = await collection?.insertOne(documentJSON);


        // check if accepted by db
        if (insertResult.acknowledged) {
            logItem = `Inserted new document with _id: ${insertResult.insertedId} to ${collection.namespace}: \n${JSON.stringify(documentJSON, null, "\t")}`
            isSuccessful = true
            loggerDB.info(logItem)
        }
        else {
            logItem = `Failed to insert document with the _id: ${insertResult.insertedId} to ${collection.namespace}\t
            ${JSON.stringify(documentJSON, null, "\t")}`
            loggerDB.error(logItem)
            isSuccessful = false
        }

        return isSuccessful
    } catch (e) {
        logItem = `Failed to insert document to database`
        loggerDB.error(logItem)
        return isSuccessful;
    }
}