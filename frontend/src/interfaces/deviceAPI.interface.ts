export type TDeviceProperty =
    | {
        propertyName: "deviceName";
        newValue: string;
    }
    | {
        propertyName: "mqttTopicID";
        newValue: string;
    }
    | {
        propertyName: "previousTopicID";
        newValue: string;
    }
    | {
        propertyName: "isAccepted";
        newValue: -1 | 0 | 1;
    }
    | {
        propertyName: "isAdminOnly";
        newValue: boolean;
    }
    | ({
        propertyName: "data";
    } & TDeviceDataProperties)
    | {
        propertyName: "isConnected";
        newValue: boolean;
    }
    | {
        propertyName: "isConnectedCheck";
        newValue: boolean;
    };

export type TDeviceDataProperties = TSwitchDataProperty | TNumberDataProperty | TMultiStateButtonProperty

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

export type TDeviceDataProperty = {
    dataPropertyName: "mqttTopicID"
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