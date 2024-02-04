import { v4 as uuidv4 } from 'uuid';
import { IMqttTopicObject, TMqttTopicObjectJSON_DB } from "../interfaces/mqttTopicObject.interface";

export default class MqttTopicObject implements IMqttTopicObject {
    _id : string
    topicName: string
    path: string

    constructor(topicName:string,path:string) {
        this._id = uuidv4();
        this.topicName = topicName;
        this.path = path;
    }

    getAsJson_DB() : TMqttTopicObjectJSON_DB {
        let json : TMqttTopicObjectJSON_DB  = {
            _id:this._id,
            topicName:this.topicName,
            path:this.path,
        }

        return json;
    }

    getAsJson() {
        let json : TMqttTopicObjectJSON_DB  = {
            _id:this._id,
            topicName:this.topicName,
            path:this.path,
        }

        return json;
    }
}