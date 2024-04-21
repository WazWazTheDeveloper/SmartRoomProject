import { TMultiStateButton, TMultiStateButtonConfig, TStateItem } from "../../interfaces/deviceData.interface"

export default class MultiStateButton implements TMultiStateButton {
    static readonly TYPE_ID = 2
    mqttTopicID: string
    // mqttSecondaryTopicID: string[]
    dataID: number
    typeID: 2
    iconName: string
    dataTitle: string
    isSensor: boolean
    currentState: number
    stateList: TStateItem[]

    constructor(
        dataID: number,
        dataTitle: string,
        iconName: string,
        isSensor: boolean,
        currentState: number,
        stateList: TStateItem[],
        mqttTopicID: string,
        // mqttSecondaryTopicID: string[]
    ) {
        this.dataID = dataID;
        this.typeID = MultiStateButton.TYPE_ID;
        this.dataTitle = dataTitle;
        this.iconName = iconName;
        this.isSensor = isSensor;
        this.currentState = currentState;
        this.stateList = stateList;
        this.mqttTopicID = mqttTopicID;
        // this.mqttSecondaryTopicID = mqttSecondaryTopicID;
    }

    static createNewData(dataConfig: TMultiStateButtonConfig): MultiStateButton {
        const dataTitle = dataConfig.dataTitle ? dataConfig.dataTitle : "";
        const iconName = dataConfig.iconName ? dataConfig.iconName : "";
        const isSensor = dataConfig.isSensor ? dataConfig.isSensor : false;
        const currentState = dataConfig.currentState ? dataConfig.currentState : 0;
        const stateList = dataConfig.stateList ? dataConfig.stateList : [];
        const mqttTopicID = dataConfig.mqttTopicID ? dataConfig.mqttTopicID : "";

        const newMultiStateButton = new MultiStateButton(
            dataConfig.dataID,
            dataTitle,
            iconName,
            isSensor,
            currentState,
            stateList,
            mqttTopicID,
            // []
        )

        return newMultiStateButton
    }

    static createDataFromDeviceDataTypes(data: TMultiStateButton): MultiStateButton {
        const newMultiStateButton = new MultiStateButton(
            data.dataID,
            data.dataTitle,
            data.iconName,
            data.isSensor,
            data.currentState,
            data.stateList,
            data.mqttTopicID,
            // data.mqttSecondaryTopicID
        )

        return newMultiStateButton
    }

    getAsJson_DB(): TMultiStateButton {
        const json: TMultiStateButton = {
            dataID: this.dataID,
            typeID: this.typeID,
            dataTitle: this.dataTitle,
            iconName: this.iconName,
            isSensor: this.isSensor,
            currentState: this.currentState,
            stateList: this.stateList,
            mqttTopicID : this.mqttTopicID,
            // mqttSecondaryTopicID : this.mqttSecondaryTopicID,
        }

        return json
    }
}