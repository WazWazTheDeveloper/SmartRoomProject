interface DataPacketType {
    sender:string
    receiver : string
    dataType: number
    dataAt: number
    event:number
    data:Array<any>
}

export {DataPacketType}