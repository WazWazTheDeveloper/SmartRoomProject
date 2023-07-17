import { dataPackage } from "../types";

class DataPackage implements dataPackage {
    sender:string
    dataType: string
    event:string
    data:Array<any>

    constructor(sender:string,dataType: string,event:string,data:Array<any>) {
        this.sender = sender
        this.dataType = dataType
        this.event = event
        this.data = data
    }

    getAsJson(): dataPackage {
        let json:dataPackage = {
            "sender" : this.sender,
            "dataType" : this.dataType,
            "event" : this.event,
            "data" : this.data,
        }

        return json
    }
}

export {DataPackage}