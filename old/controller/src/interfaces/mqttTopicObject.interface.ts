export type TMqttTopicProperty = {
    propertyName: "topicName"
    newValue: string
} |
{
    propertyName: "path"
    newValue: string
}

export interface IMqttTopicObject {
    _id: string
    topicName: string
    path: string
    previousPath: string
    topicType: number
}

export type TMqttTopicObjectJSON_DB = {
    _id: string
    topicName: string
    path: string
    previousPath: string
    topicType: number
}