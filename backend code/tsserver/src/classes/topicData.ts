import { eventFunctionData, generalTopic, topicData } from "../types"

class TopicData implements topicData{
    topicName: string
    topicPath: string
    // TODO: maybe change this to a string
    dataType: number
    isVisible:boolean
    event: string
    functionData: eventFunctionData

    static readonly anyType = -1;
    static readonly settingsType = 0;
    constructor(_generalTopic: generalTopic, dataType: number,isVisible:boolean, event: string, functionData: eventFunctionData) {
        this.topicName = _generalTopic.topicName;
        this.topicPath = _generalTopic.topicPath
        this.dataType = dataType
        this.isVisible = isVisible
        this.event = event
        this.functionData = functionData
    }

    getAsJsonForArduino() {
        let dataJson = {
            // topicName: this.topicName,
            topicPath: this.topicPath,
            dataType: this.dataType,
            // isVisible: this.isVisible,
            event: this.event,
            functionData: this.functionData,
        }

        return dataJson
    }
}

export {TopicData}