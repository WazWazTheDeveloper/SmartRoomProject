interface dataPacket {
    sender:string
    dataType: string
    event:string
    data:Array<any>
}

export {dataPacket}