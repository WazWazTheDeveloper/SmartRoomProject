import {eventFunctionData} from '../types'

interface device {
    deviceName:string
    uuid: string
    deviceType: Array<number>
    listenTo: Array<topicData>
    publishTo: Array<topicData>
    isConnected: boolean
    isConnectedCheck: boolean
    deviceData: Array<any>
}

interface topicData {
    topicName : string
    topicPath : string
    isVisible:boolean
    dataType : number //a string to represent the type of data send such as "data0" or "data1". using a number is better for memory for arduino
    event : string
    functionData: eventFunctionData
}

interface deviceType {
    setVar:Function
    defaultUpdateFunction:Function
    getData:Function
    getAsJson:Function
    getVar:Function
    // loadFromFile: Function
}

export {device,topicData,deviceType}
