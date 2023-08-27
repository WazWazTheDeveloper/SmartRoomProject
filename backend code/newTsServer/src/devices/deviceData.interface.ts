interface IDeviceData {
    setVar:Function
    setData:Function
    // TODO: probably dont need it as you always want to send full data
    getData:Function
    getAsJson:Function
    getVar:Function
    // createFromJson:Function
    // TODO: delete this as it is unused
    // loadFromFile: Function
}

interface AirconditionerDataType {
    isOn: Boolean
    temp: 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32
    mode: 0|1|2|3|4
    speed: 0|1|2|3
    swing1: Boolean
    swing2: Boolean
    timer: number
    // fullhours: number
    // isHalfHour: Boolean
    isStrong: Boolean
    isFeeling: Boolean
    isSleep: Boolean
    isScreen: Boolean
    isHealth: Boolean
}

interface SwitchDataType {
    isOn: boolean
}

export {IDeviceData , AirconditionerDataType,SwitchDataType}
