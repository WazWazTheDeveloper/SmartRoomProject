import { TDeviceData,  TSwitchData, TSwitchDataConfig } from "../../interfaces/deviceData.interface";

export default class SwitchData implements TSwitchData {
    static readonly TYPE_ID = 0
    mqttTopicID: string
    // mqttSecondaryTopicID: string[]
    dataID: number
    iconName: string
    dataTitle: string
    isSensor: boolean
    typeID: 0
    isOn: boolean
    onName: string
    offName: string

    constructor(
        dataID: number,
        dataTitle: string,
        iconName: string,
        isSensor: boolean,
        isOn: boolean,
        onName: string,
        offName: string,
        mqttTopicID: string,
        // mqttSecondaryTopicID: string[]
    ) {
        this.dataID = dataID
        this.iconName = iconName
        this.dataTitle = dataTitle
        this.isSensor = isSensor
        this.typeID = SwitchData.TYPE_ID
        this.isOn = isOn
        this.onName = onName
        this.offName = offName
        this.mqttTopicID = mqttTopicID;
        // this.mqttSecondaryTopicID = mqttSecondaryTopicID;
    }

    static createNewData(dataConfig: TSwitchDataConfig): SwitchData {
        const dataTitle = dataConfig.dataTitle ? dataConfig.dataTitle : "";
        const iconName = dataConfig.iconName ? dataConfig.iconName : "";
        const isSensor = dataConfig.isSensor ? dataConfig.isSensor : false;
        const isOn = dataConfig.isOn ? dataConfig.isOn : false;
        const onName = dataConfig.onName ? dataConfig.onName : "";
        const offName = dataConfig.onName ? dataConfig.onName : "";
        const mqttTopicID = dataConfig.mqttTopicID ? dataConfig.mqttTopicID : "";

        const newSwitchData = new SwitchData(
            dataConfig.dataID,
            dataTitle,
            iconName,
            isSensor,
            isOn,
            onName,
            offName,
            mqttTopicID,
            // []
            )

        return newSwitchData;
    }

    static createDataFromDeviceDataTypes(data: TSwitchData):SwitchData {
        const newSwitchData = new SwitchData(
            data.dataID,
            data.dataTitle,
            data.iconName,
            data.isSensor,
            data.isOn,
            data.onName,
            data.offName,
            data.mqttTopicID,
            // data.mqttSecondaryTopicID
            )

        return newSwitchData;
    }

    getAsJson_DB() : TSwitchData {
        const data : TSwitchData = {
            dataID : this.dataID,
            dataTitle : this.dataTitle,
            iconName : this.iconName,
            isSensor : this.isSensor,
            isOn : this.isOn,
            onName : this.onName,
            offName : this.offName,
            typeID: SwitchData.TYPE_ID,
            mqttTopicID : this.mqttTopicID,
            // mqttSecondaryTopicID : this.mqttSecondaryTopicID,
        }

        return data;
    }
}