import { v4 as uuidv4 } from "uuid";
import { DB_LOG, logEvents } from "../middleware/logger";
import MqttTopicObject from "../models/mqttTopicObject";
import {
    COLLECTION_MQTT_TOPICS,
    collections,
    createDocument,
    getDocuments,
    getDocumentsAggregate,
    updateDocument,
} from "./mongoDBService";
import {
    TMqttTopicObjectJSON_DB,
    TMqttTopicProperty,
} from "../interfaces/mqttTopicObject.interface";
import { UpdateFilter } from "mongodb";
import { TDeviceJSON_DB } from "../interfaces/device.interface";

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

export async function updateMqttTopic(
    _id: string,
    propertyList: TMqttTopicProperty[]
) {
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
                foreignField: "data.mqttPrimeryTopicID",
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
export async function getTopicIDsByPath(path: string): Promise<string[]> {
    const aggregationList = [
        {
            $match: {
                path: path,
            },
        },
        {
            $project: {
                _id: 1,
            },
        },
    ];

    const result = await getDocumentsAggregate<{ _id: string }>(
        COLLECTION_MQTT_TOPICS,
        aggregationList
    );
    const topicIDs: string[] = [];

    for (let i = 0; i < result.length; i++) {
        const topidID = result[i]._id;
        topicIDs.push(topidID);
    }

    return topicIDs;
}
