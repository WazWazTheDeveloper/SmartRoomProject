export type TDeviceData = {
    dataID: number
    typeID: number
    iconName: string
    dataTitle: string
    isSensor: boolean
    mqttPrimeryTopicID: string
}

export type TDeviceDeviceDataProperties = {
    mqttPrimeryTopicID?: string
}

export type TDeviceDataDeviceProperties = {
    dataID: number
    mqttPrimeryTopicID?: string
    typeID: number
    value: any
}

export type TDeviceDataConfig = {
    mqttPrimeryTopicID?: string
    dataID: number
    typeID: number
    iconName?: string
    dataTitle?: string
    isSensor?: boolean
}

export type TDeviceDataProperty = {
    dataPropertyName: "mqttPrimeryTopicID"
    newValue: string
} | {
    dataPropertyName: "iconName"
    newValue: string
} | {
    dataPropertyName: "dataTitle"
    newValue: string
} | {
    dataPropertyName: "isSensor"
    newValue: boolean
}

export type DeviceDataTypes = TSwitchData | TNumberData | TMultiStateButton
export type DeviceDataTypesConfigs = TSwitchDataConfig | TNumberDataConfig | TMultiStateButtonConfig

export type TSwitchData = {
    isOn: boolean
    onName: string
    offName: string
} & TDeviceData

export type TSwitchDataConfig = {
    isOn?: boolean
    onName?: string
    offName?: string
} & TDeviceDataConfig

export type TSwitchDataProperty = ({
    dataPropertyName: "isOn"
    newValue: boolean
} | {
    dataPropertyName: "onName"
    newValue: string
} | {
    dataPropertyName: "offName"
    newValue: string
} | TDeviceDataProperty) & {
    dataID: number
    typeID: 0
}

export type TNumberData = {
    currentValue: number
    minValue: number
    maxValue: number
    jumpValue: number
    symbol: string
} & TDeviceData

export type TNumberDataConfig = {
    currentValue?: number
    minValue?: number
    maxValue?: number
    jumpValue?: number
    symbol?: string
} & TDeviceDataConfig

export type TNumberDataProperty = ({
    dataPropertyName: "currentValue"
    newValue: Number
} | {
    dataPropertyName: "minValue"
    newValue: Number
} | {
    dataPropertyName: "maxValue"
    newValue: Number
} | {
    dataPropertyName: "jumpValue"
    newValue: Number
} | {
    dataPropertyName: "symbol"
    newValue: string
} | TDeviceDataProperty) & {
    dataID: number
    typeID: 1
}


export type TMultiStateButton = {
    currentState: number
    stateList: TStateItem[]
} & TDeviceData

export type TMultiStateButtonConfig = {
    currentState?: number
    stateList?: TStateItem[]
} & TDeviceDataConfig

export type TMultiStateButtonProperty = ({
    dataPropertyName: "currentState"
    newValue: Number
} | {
    dataPropertyName: "stateList"
    operation: "add"
    newState: TStateItem
} | {
    dataPropertyName: "stateList"
    operation: "delete"
    stateValue: number
} | {
    dataPropertyName: "stateList"
    operation: "update"
    state: {
        stateValue: number
        isIcon?: boolean
        icon?: string
        stateTitle?: string
    }
} | TDeviceDataProperty) & {
    dataID: number
    typeID: 2
}

export type TStateItem = {
    stateValue: number
    isIcon: boolean
    icon: string
    stateTitle: string
}

export type TDeviceDataProperties = TSwitchDataProperty | TNumberDataProperty | TMultiStateButtonProperty