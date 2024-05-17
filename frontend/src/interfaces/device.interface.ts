export type TDevice = {
    _id: string;
    deviceTargetID: string;
    deviceName: string;
    mqttTopicID: string;
    previousTopicID: string;
    isAccepted: -1 | 0 | 1;
    isAdminOnly: boolean;
    data: TDeviceDataObject[];
    isConnected: boolean;
    isConnectedCheck: boolean;
}

export type TDeviceDataObject = TSwitchData | TNumberData | TMultiStateButton;

export type TDeviceData = {
    dataID: number
    typeID: number
    iconName: string
    dataTitle: string
    isSensor: boolean
    mqttTopicID: string
}

export type TSwitchData = {
    isOn: boolean
    onName: string
    offName: string
    typeID: 0
} & TDeviceData

export type TNumberData = {
    currentValue: number
    minValue: number
    maxValue: number
    jumpValue: number
    symbol: string
    typeID: 1
} & TDeviceData
export type TMultiStateButton = {
    currentState: number
    stateList: TStateItem[]
    typeID: 2
} & TDeviceData

export type TStateItem = {
    stateValue: number
    isIcon: boolean
    icon: string
    stateTitle: string
}

export const SWITCH_TYPE = 0
export const NUMBER_TYPE = 1
export const MULTI_STATE_BUTTON_TYPE = 2