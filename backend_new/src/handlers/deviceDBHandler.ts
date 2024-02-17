import * as mongoDB from "mongodb";

export function deviceDBHandler(changeEvent:mongoDB.ChangeStreamDocument) {
    if(changeEvent.operationType != "update") return
    
    const changedDeviceID = changeEvent.documentKey._id

    // get all task ids where changedDeviceID is included
    // call taskCheckHandler(task id)
}