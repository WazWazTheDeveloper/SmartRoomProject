import {eventFunctionData} from '../types'
interface generalData {
    topicList : Array<topicData>
    deviceList : Array<deviceListItem>
}

interface topicData {
    name : string
    topicPath : string
    dataType : string //a string to represent the type of data send such as "data0" or "data1"
    event : string
    functionData: eventFunctionData
}

interface deviceListItem{
    UUID: string
    name: string
    deviceType: Array<string>
}
export {generalData ,topicData, deviceListItem }