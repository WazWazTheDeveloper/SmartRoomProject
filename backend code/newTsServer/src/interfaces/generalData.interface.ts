interface GeneralDataType {
    topicList : Array<GeneralTopicType>
    deviceList : Array<DeviceListItemType>
    taskList : Array<GeneralTaskType>
    usernameList: Array<string>
}

interface GeneralTopicType {
    topicName: string
    topicPath: string
    isVisible:boolean
}


interface DeviceListItemType{
    UUID: string
    name: string
    deviceType: Array<number>
}
interface GeneralTaskType {
    taskId : string
}
export {GeneralDataType ,GeneralTopicType, DeviceListItemType,GeneralTaskType }