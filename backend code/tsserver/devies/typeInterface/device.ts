import {eventFunctionData} from '../types'

interface device {
    deviceName:string
    uuid: string
    deviceType: Array<string>
    listenTo: Array<topicData>
    publishTo: Array<topicData>
    isConnected: boolean
    deviceData: Array<any>
}

interface topicData {
    topicName : string
    topicPath : string
    dataType : string //a string to represent the type of data send such as "data0" or "data1"
    event : string
    functionData: eventFunctionData
}

interface deviceType {
    setVar:Function
    defaultUpdateFunction:Function
}

export {device,topicData,deviceType}
