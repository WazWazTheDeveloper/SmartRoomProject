import { v4 as uuidv4 } from 'uuid';
import { IMqttTopicObject, TMqttTopicObjectJSON_DB } from "../interfaces/mqttTopicObject.interface";

export default class MqttTopicObject implements IMqttTopicObject {
    _id: string
    topicName: string
    path: string

    constructor(_id:string,topicName: string, path: string) {
        this._id = _id;
        this.topicName = topicName;
        this.path = path;
    }

    static createNewMqttTopicObject(_id:string,topicName: string, path: string): MqttTopicObject {
        const newDevice = new MqttTopicObject(_id, topicName, path)
        return newDevice
    }

    // create device from TDeviceJSON_DB JSON object
    static createMqttTopicFromTDeviceJSON_DB(topicData: TMqttTopicObjectJSON_DB): MqttTopicObject {
        const newMqttTopic = new MqttTopicObject(
            topicData._id,
            topicData.topicName,
            topicData.path,
        )
        return newMqttTopic
    }

    getAsJson_DB(): TMqttTopicObjectJSON_DB {
        let json: TMqttTopicObjectJSON_DB = {
            _id: this._id,
            topicName: this.topicName,
            path: this.path,
        }

        return json;
    }

    getAsJson() {
        let json: TMqttTopicObjectJSON_DB = {
            _id: this._id,
            topicName: this.topicName,
            path: this.path,
        }

        return json;
    }
}