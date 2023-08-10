interface AppdataEvent {
    deviceUUID:string
    event: string
    dataType : number
    dataAt : number
    oldTopic : string
}

export {AppdataEvent}