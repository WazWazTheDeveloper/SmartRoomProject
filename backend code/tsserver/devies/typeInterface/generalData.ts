interface generalData {
    topicList : Array<generalTopic>
    deviceList : Array<deviceListItem>
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
export {generalData ,generalTopic, deviceListItem }