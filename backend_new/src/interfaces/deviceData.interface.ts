export type TDeviceData = {
    dataID:number
    typeID:number
    iconName:string
    dataTitle:string
    isSensor: boolean
} 

export type TDeviceDataConfig = {
    dataID:number
    typeID:number
    iconName?:string
    dataTitle?:string
    isSensor?: boolean
} 

export type DeviceDataTypes = TSwitchData | TNumberData | TMultiStateButton
export type DeviceDataTypesConfigs = TSwitchDataConfig | TNumberDataConfig | TMultiStateButtonConfig

export type TSwitchData = {
    isOn: boolean
    onName:string
    offName:string
} & TDeviceData

export type TSwitchDataConfig = {
    isOn?: boolean
    onName?:string
    ofName?:string
} & TDeviceDataConfig

export type TNumberData = {
    currentValue:Number
    minValue:Number
    maxValue:Number
    jumpValue:Number
    symbol:string
} & TDeviceData

export type TNumberDataConfig = {
    currentValue?:Number
    minValue?:Number
    maxValue?:Number
    jumpValue?:Number
    symbol?:string
} & TDeviceDataConfig

export type TMultiStateButton = {
    currentState:number
    stateList:TStateItem[]
} & TDeviceData

export type TMultiStateButtonConfig = {
    currentState?:number
    stateList?:TStateItem[]
} & TDeviceDataConfig

export type TStateItem = {
    stateValue: number
    isIcon:boolean
    icon:string
    stateTitle:string
}
