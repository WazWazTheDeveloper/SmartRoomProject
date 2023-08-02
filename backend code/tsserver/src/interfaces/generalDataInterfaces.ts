interface generalData {
    topicList : Array<generalTopic>
    deviceList : Array<deviceListItem>
    taskList : Array<generalTask>
}

interface generalTopic {
    topicName: string
    topicPath: string
    isVisible:boolean
}


interface deviceListItem{
    UUID: string
    name: string
    deviceType: Array<number>
}
interface generalTask {
    taskId : string
}
export {generalData ,generalTopic, deviceListItem,generalTask }