import { eventFunctionData, generalTopic, topicData } from "../types"

class TopicData implements topicData{
    topicName: string
    topicPath: string
    dataType: string
    event: string
    functionData: eventFunctionData

    constructor(_generalTopic: generalTopic, dataType: string, event: string, functionData: eventFunctionData) {
        this.topicName = _generalTopic.topicName;
        this.topicPath = _generalTopic.topicPath
        this.dataType = dataType
        this.event = event
        this.functionData = functionData
    }
}

export {TopicData}