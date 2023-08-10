import { DataPacketType } from "../interfaces/dataPacket.interface"

class DataPacket implements DataPacketType {
    static readonly SENDER_SERVER = "server"
    static readonly REVEIVER_ALL = "*"
    
    static readonly NON_EVENT = -1
    static readonly DEVICE_TOPIC_CHANGE = 0
    static readonly CHECK_IS_CONNECTED = 1
    static readonly DEVICE_DATA_CHANGE = 2
    static readonly DATA_CHANGE = 3
    
    sender:string
    receiver : string
    dataType: number
    dataAt: number
    event:number
    data:any

    constructor(sender:string,receiver:string,dataType: number,dataAt: number,event:number,data:any) {
        this.sender = sender;
        this.receiver = receiver;
        this.dataType = dataType;
        this.dataAt = dataAt;
        this.event = event;
        this.data = data;
    }

    getAsJson(): DataPacketType {
        let json:DataPacketType = {
            "sender" : this.sender,
            "receiver" : this.receiver,
            "dataType" : this.dataType,
            "dataAt" : this.dataAt,
            "event" : this.event,
            "data" : this.data
        }

        return json
    }
}

export {DataPacket}