import { Console } from "console";
import { TDeviceJSON_DB } from "../interfaces/device.interface";
import { getCollection } from "../services/mongoDBService";
import * as mongoDB from "mongodb";

export async function init() {
    let collection : mongoDB.Collection<TDeviceJSON_DB>
    try {
        collection = await getCollection("devices") as mongoDB.Collection<TDeviceJSON_DB>;
    }catch(e) {
        // TODO: maybe add ERROR LOG
        console.log(e)
        return false
    }

    const changeStream = collection.watch()
    changeStream.on("change",deviceDBHandler);

    return true
}

function deviceDBHandler(changeEvent:mongoDB.ChangeStreamDocument) {
    console.log(changeEvent);
}