import * as DeviceService from "../services/deviceService";
import * as MqttClientService from "../services/mqttClientService";
import * as mongoDB from "mongodb";

/**
 * @description 
 * this function is called when the server starts
 * the functions subscribes to all the data primeryTopics
 */
export async function initDeviceSubscriptions() {
    let aggregate = [
        {
            $unwind: "$data",
        },
        {
            $lookup: {
                from: "mqttTopics",
                localField: "data.mqttPrimeryTopicID",
                foreignField: "_id",
                as: "data.mqttPrimeryTopicPath",
            },
        },
        {
            $unwind: {
                path: "$data.mqttPrimeryTopicPath",
            },
        },
        {
            $group: {
                _id: null,
                mqttPrimeryTopicPaths: {
                    $addToSet: "$data.mqttPrimeryTopicPath.path",
                },
            },
        },
        {
            $project: {
                _id: 0,
                mqttPrimeryTopicPaths: 1,
            },
        },
    ];

    try {
        const pathsArrayObj: any = (
            await DeviceService.aggregateDevices(aggregate)
        )[0];
        const pathsArray: any = pathsArrayObj.mqttPrimeryTopicPaths;
        for (let i = 0; i < pathsArray.length; i++) {
            const path = pathsArray[i];
            MqttClientService.subscribeToTopic(path);
        }
    } catch (e) {
        // TODO: add error
    }
}

/**
 * @description - the functions is called when a new device is inserted into the db and subscribes to all the data primeryMqttTopics
 * 
 * @param changeEvent - a change event form mongodb
 */
export async function subscribeToNewDevice(changeEvent: mongoDB.ChangeStreamDocument) {
    if (changeEvent.operationType != "insert") return;
    if (typeof changeEvent.fullDocument.mqttTopicID != "string") return;
    let aggregate = [
        {
            $match: {
                _id: changeEvent.fullDocument._id,
            },
        },
        {
            $lookup: {
                from: "mqttTopics",
                localField: "data.mqttPrimeryTopicID",
                foreignField: "_id",
                as: "data.mqttPrimeryTopicPath",
            },
        },
        {
            $unwind:
                {
                    path: "$data.mqttPrimeryTopicPath",
                },
        },
        {
            $group: {
                _id: null,
                mqttPrimeryTopicPaths: {
                    $addToSet: "$data.mqttPrimeryTopicPath.path",
                },
            },
        },
        {
            $project: {
                _id: 0,
                mqttPrimeryTopicPaths: 1,
            },
        },
    ];
    try {
        const topicsObj: any = (
            await DeviceService.aggregateDevices(aggregate)
        )[0];
        const topicsArr: any[] = topicsObj.mqttPrimeryTopicPaths;
        if (topicsArr.length > 0) {
            for (let i = 0; i < topicsArr.length; i++) {
                const path = topicsArr[i];
                MqttClientService.subscribeToTopic(path);
            }
        } else {
            // TODO: add error
        }
    } catch (e) {
        // TODO: add error
    }
}

// IMPLEMENT
export async function unsubscribeFromDeletedDevice() {
    
}