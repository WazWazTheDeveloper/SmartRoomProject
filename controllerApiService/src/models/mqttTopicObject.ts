import { IMqttTopicObject, TMqttTopicObjectJSON_DB } from "../interfaces/mqttTopicObject.interface";

export default class MqttTopicObject implements IMqttTopicObject {
    _id: string
    topicName: string
    path: string
    topicType: number
    previousPath: string

    constructor(_id: string, topicName: string, path: string, previousPath: string, topicType: number) {
        this._id = _id;
        this.topicName = topicName;
        this.path = path;
        this.topicType = topicType;
        this.previousPath = previousPath;
    }

    static createNewMqttTopicObject(_id: string, topicName: string, path: string, topicType: number): MqttTopicObject {
        const newDevice = new MqttTopicObject(_id, topicName, path,path, topicType)
        return newDevice
    }

    // create device from TDeviceJSON_DB JSON object
    static createMqttTopicFromTMqttTopicObjectJSON_DB(topicData: TMqttTopicObjectJSON_DB): MqttTopicObject {
        const newMqttTopic = new MqttTopicObject(
            topicData._id,
            topicData.topicName,
            topicData.path,
            topicData.previousPath,
            topicData.topicType,
        )
        return newMqttTopic
    }

    getAsJson_DB(): TMqttTopicObjectJSON_DB {
        let json: TMqttTopicObjectJSON_DB = {
            _id: this._id,
            topicName: this.topicName,
            path: this.path,
            previousPath: this.previousPath,
            topicType: this.topicType,
        }

        return json;
    }

    getAsJson() {
        let json: TMqttTopicObjectJSON_DB = {
            _id: this._id,
            topicName: this.topicName,
            path: this.path,
            previousPath: this.previousPath,
            topicType: this.topicType,
        }

        return json;
    }
}