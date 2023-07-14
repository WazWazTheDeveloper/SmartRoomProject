import { TopicData } from "../typeClasses/device"

interface subType {
    topicData: TopicData
    callbackFunction: Function
}

export {subType}