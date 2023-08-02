interface dataPacket {
    sender:string
    dataType: number
    event:string
    data:Array<any>
}

export {dataPacket}