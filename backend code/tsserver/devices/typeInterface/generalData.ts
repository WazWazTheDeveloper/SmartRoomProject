interface generalData {
    topicList : Array<generalTopic>
    deviceList : Array<deviceListItem>
    taskList : Array<generalTask>
}

interface generalTopic {
    topicName: string
    topicPath: string
}


interface deviceListItem{
    UUID: string
    name: string
    deviceType: Array<string>
}
interface generalTask {
    taskId : string
}
export {generalData ,generalTopic, deviceListItem,generalTask }