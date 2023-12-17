interface IDeviceData {
    setVar:Function
    setData:Function
    getData:Function
    getAsJson:Function
    getVar:Function
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
    iconName:string
    isOn: boolean
    onName:string
    offName:string
    isSensor: boolean
}

export interface NumberDataType {
    iconName:string
    number:Number
    symbol : string
    isSensor : boolean
    minVal : number
    maxVal : number
    jumpVal : number
}

export interface MultiStateButtonDataType {
    iconName:string
    currentState : number
    stateList : stateItem[]
}

export interface stateItem {
    stateNumber : number,
    isIcon : boolean
    icon: string
    string: string
}

export {IDeviceData , AirconditionerDataType,SwitchDataType}
