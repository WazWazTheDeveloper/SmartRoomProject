import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";
import { v4 as uuidv4 } from 'uuid';
import { DB_LOG, logEvents } from '../middleware/logger';

export async function connectToDatabase() {
    const client: mongoDB.MongoClient = new mongoDB.MongoClient(`mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_IP}/?replicaSet=rs0` as string, {
        pkFactory: { createPk: () => uuidv4() }
    });

    await client.connect();

    // init collections and db
    const db: mongoDB.Db = client.db(process.env.DATABASE_NAME as string);
    
    logEvents(`Successfully connected to database`, DB_LOG)
}