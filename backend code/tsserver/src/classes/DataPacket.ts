import { dataPacket } from "../types";

class DataPacket implements dataPacket {
    sender:string
    dataType: number
    event:string
    data:Array<any>

    constructor(sender:string,dataType: number,event:string,data:Array<any>) {
        this.sender = sender
        this.dataType = dataType
        this.event = event
        this.data = data
    }

    getAsJson(): dataPacket {
        let json:dataPacket = {
            "sender" : this.sender,
            "dataType" : this.dataType,
            "event" : this.event,
            "data" : this.data
        }

        return json
    }
}

export {DataPacket}