import { topicData } from "./generalData"

interface device {
    uuid: string
    deviceType: Array<string>
    listenTo: Array<topicData>
    publishTo: Array<topicData>
    isConnected: boolean
    deviceData: Array<any>
}

interface topicEvent {
    topicName: string
    topic: string
    // event: string
}

export {device}
