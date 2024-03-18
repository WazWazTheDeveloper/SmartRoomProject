import { v4 as uuidv4 } from "uuid";
import { DB_LOG, logEvents } from "../middleware/logger";
import MqttTopicObject from "../models/mqttTopicObject";
import {COLLECTION_MQTT_TOPICS,collections,createDocument,getCollection,getDocuments,getDocumentsAggregate,updateDocument,} from "./mongoDBService";
import {TMqttTopicObjectJSON_DB,TMqttTopicProperty,} from "../interfaces/mqttTopicObject.interface";
import { UpdateFilter } from "mongodb";
import { TDeviceJSON_DB } from "../interfaces/device.interface";
import * as mongoDB from "mongodb";
import SwitchData from "../models/dataTypes/switchData";
import NumberData from "../models/dataTypes/numberData";
import MultiStateButton from "../models/dataTypes/multiStateButtonData";

type MqttTopicResult =
    | {
        isSuccessful: false;
    }
    | {
        isSuccessful: true;
        mqttTopicObject: MqttTopicObject;
    };

export async function createNewMqttTopic(
    topicName: string,
    topicPath: string,
    topicType: number
): Promise<MqttTopicResult> {
    let functionResult: MqttTopicResult = { isSuccessful: false };
    const _id = uuidv4();

    // create and insert mqtt topic
    const mqttTopic = MqttTopicObject.createNewMqttTopicObject(
        _id,
        topicName,
        topicPath,
        topicType
    );
    const isSuccessful = await createDocument(
        COLLECTION_MQTT_TOPICS,
        mqttTopic.getAsJson_DB()
    );

    // check if accepted by db
    if (isSuccessful) {
        functionResult = {
            isSuccessful: true,
            mqttTopicObject: mqttTopic,
        };
    } else {
        functionResult = {
            isSuccessful: false,
        };
    }

    return functionResult;
}

export async function getMqttTopic(_id: string): Promise<MqttTopicResult> {
    let functionResult: MqttTopicResult = { isSuccessful: false };
    let logItem = "";

    //query
    const fillter = { _id: _id };
    const findResultArr = await getDocuments<TMqttTopicObjectJSON_DB>(
        COLLECTION_MQTT_TOPICS,
        fillter
    );

    //validation
    if (findResultArr.length > 1) {
        let err = `Multipale documents with _id:${_id} in: mqttCollection`;
        logEvents(err, DB_LOG);
        throw new Error(err);
    } else if (findResultArr.length == 0) {
        functionResult = { isSuccessful: false };
    } else {
        const queryMqttTopic =
            MqttTopicObject.createMqttTopicFromTDeviceJSON_DB(findResultArr[0]);
        functionResult = {
            isSuccessful: true,
            mqttTopicObject: queryMqttTopic,
        };
    }

    return functionResult;
}

export async function updateMqttTopic(_id: string, propertyList: TMqttTopicProperty[]) {
    const deviceCollection = collections.mqttTopics;

    //create update obj from propertyList
    const set: any = {};
    for (let index = 0; index < propertyList.length; index++) {
        const property = propertyList[index];
        set[property.propertyName] = property.newValue;
    }

    const updateFilter: UpdateFilter<TMqttTopicObjectJSON_DB> = {
        $set: { set },
    };

    const filter = { _id: _id };
    await updateDocument(COLLECTION_MQTT_TOPICS, filter, updateFilter);
}

export async function getDevicesUsingTopic(topicPath: string) {
    let aggregationList = [
        {
            $match: {
                path: topicPath,
            },
        },
        {
            $project: {
                _id: 1,
            },
        },
        {
            $lookup: {
                from: "devices",
                localField: "_id",
                foreignField: "data.mqttTopicID",
                as: "result0",
            },
        },
        {
            $unwind: {
                path: "$result0",
            },
        },
        {
            $replaceRoot: {
                newRoot: "$result0",
            },
        },
    ];
    const result = await getDocumentsAggregate<TDeviceJSON_DB>(
        COLLECTION_MQTT_TOPICS,
        aggregationList
    );

    return result;
}
export async function getTopicIDsByPath(path: string) {
    const aggregationList = [
        {
            $match: {
                path: path,
            },
        },
        {
            $project: {
                _id: 1,
                topicType: 1
            },
        },
    ];

    const result = await getDocumentsAggregate<{ _id: string, topicType: number }>(
        COLLECTION_MQTT_TOPICS,
        aggregationList
    );


    return result;
}

export async function initializeMqttTopicHandler(handler: (changeEvent: mongoDB.ChangeStreamDocument) => void) {
    let collection: mongoDB.Collection<TDeviceJSON_DB>;
    try {
        collection = (await getCollection(COLLECTION_MQTT_TOPICS)) as mongoDB.Collection<TDeviceJSON_DB>;
    } catch (e) {
        // TODO: maybe add ERROR LOG
        console.log(e);
        return false;
    }

    const changeStream = collection.watch();
    changeStream.on("change", handler);

    return true;
}

export function getTypeOfTopic(topicType: number) {
    switch (topicType) {
        case -1:
            return "any"
        case SwitchData.TYPE_ID:
            return "boolean"
        case NumberData.TYPE_ID:
            return "number"
        case MultiStateButton.TYPE_ID:
            return "number"
        default :
            throw "unknown topicType"
    }
}