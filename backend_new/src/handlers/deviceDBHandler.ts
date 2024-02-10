import { Console } from "console";
import { TDeviceJSON_DB } from "../interfaces/device.interface";
import { getCollection } from "../services/mongoDBService";
import * as mongoDB from "mongodb";

export function deviceDBHandler(changeEvent:mongoDB.ChangeStreamDocument) {
    console.log(changeEvent);
}