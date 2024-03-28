import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";
import { v4 as uuidv4 } from 'uuid';
import { TUser } from "../interfaces/user.interface";
import { TPermissionGroup } from "../interfaces/permissionGroup.interface";
import { loggerDB } from "./loggerService";

type TCollection = {
    users?: mongoDB.Collection<TUser>
    permissionGroups?: mongoDB.Collection<TPermissionGroup>
}

type collectionNames = "users" | "permissionGroups"

type collectionTypes =
    mongoDB.Collection<TUser> |
    mongoDB.Collection<TPermissionGroup>

export const collections: TCollection = {}

export async function connectToDatabase() {
    const client: mongoDB.MongoClient = new mongoDB.MongoClient(`mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_IP}/?replicaSet=rs0` as string, {
        pkFactory: { createPk: () => uuidv4() }
    });

    try{

        await client.connect();
        
        // init collections and db
        const db: mongoDB.Db = client.db(process.env.DATABASE_NAME as string);
        const users: mongoDB.Collection<TUser> = db.collection<TUser>(process.env.DATABASE_COLLECTION_USERS as string);
        const permissionGroups: mongoDB.Collection<TPermissionGroup> = db.collection<TPermissionGroup>(process.env.DATABASE_COLLECTION_PERMISSION_GROUPS as string);
        
        collections.users = users
        collections.permissionGroups = permissionGroups
        
        loggerDB.info("Successfully connected to users database")
    }finally {
        loggerDB.warn("Closing connection to users database")
        await client.close();
    }
}

// TODO: fishish
export async function createDocument(collectionStr: collectionNames, documentJSON: any) {
    let isSuccessful = false;
    const _id = uuidv4()
    let logItem = "";

    // check if db collection exist
    let collection: collectionTypes | undefined = collections[collectionStr]
    if (!collection) {
        const err = "no collection found \tat mongoDBService.ts \tat updateDocument"
        loggerDB.error(err)
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

    return isSuccessful
}