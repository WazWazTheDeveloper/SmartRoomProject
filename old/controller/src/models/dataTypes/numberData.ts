import { TNumberData, TNumberDataConfig } from "../../interfaces/deviceData.interface";

export default class NumberData implements TNumberData {
    static readonly TYPE_ID = 1
    mqttTopicID: string
    // mqttSecondaryTopicID: string[]
    dataID:number
    typeID:1
    iconName:string
    dataTitle:string
    isSensor: boolean
    currentValue:number
    minValue:number
    maxValue:number
    jumpValue:number
    symbol:string
    constructor(
        dataID:number,
        dataTitle:string,
        iconName:string,
        isSensor: boolean,
        currentValue:number,
        minValue:number,
        maxValue:number,
        jumpValue:number,
        symbol:string,
        mqttTopicID: string,
        // mqttSecondaryTopicID: string[]
    ){
        this.currentValue = currentValue;
        this.minValue = minValue;
        this.maxValue = maxValue;
        this.jumpValue = jumpValue;
        this.symbol = symbol;
        this.dataID = dataID;
        this.iconName = iconName;
        this.dataTitle = dataTitle;
        this.isSensor = isSensor;
        this.typeID = NumberData.TYPE_ID;
        this.mqttTopicID = mqttTopicID;
        // this.mqttSecondaryTopicID = mqttSecondaryTopicID;
    }

    static createNewData(dataConfig: TNumberDataConfig): NumberData {
        const dataTitle = dataConfig.dataTitle ? dataConfig.dataTitle : "";
        const iconName = dataConfig.iconName ? dataConfig.iconName : "";
        const isSensor = dataConfig.isSensor ? dataConfig.isSensor : false;
        const currentValue = dataConfig.currentValue ? dataConfig.currentValue : 0;
        const minValue = dataConfig.minValue ? dataConfig.minValue : 0;
        const maxValue = dataConfig.maxValue ? dataConfig.maxValue : 100;
        const jumpValue = dataConfig.jumpValue ? dataConfig.jumpValue : 1;
        const symbol = dataConfig.symbol ? dataConfig.symbol : "";
        const mqttTopicID = dataConfig.mqttTopicID ? dataConfig.mqttTopicID : "";

        const newNumberData = new NumberData(
            dataConfig.dataID,
            dataTitle,
            iconName,
            isSensor,
            currentValue,
            minValue,
            maxValue,
            jumpValue,
            symbol,
            mqttTopicID,
            // []
            )

        return newNumberData;
    }

    static createDataFromDeviceDataTypes(data: TNumberData):NumberData {
        const newNumberData = new NumberData(
            data.dataID,
            data.dataTitle,
            data.iconName,
            data.isSensor,
            data.currentValue,
            data.minValue,
            data.maxValue,
            data.jumpValue,
            data.symbol,
            data.mqttTopicID,
            // data.mqttSecondaryTopicID
            )

        return newNumberData;
    }

    getAsJson_DB() : TNumberData {
        const json:TNumberData = {
            currentValue:this.currentValue,
            minValue:this.minValue,
            maxValue:this.maxValue,
            jumpValue:this.jumpValue,
            symbol:this.symbol,
            dataID:this.dataID,
            typeID:this.typeID,
            iconName:this.iconName,
            dataTitle:this.dataTitle,
            isSensor: this.isSensor,
            mqttTopicID : this.mqttTopicID,
            // mqttSecondaryTopicID : this.mqttSecondaryTopicID,
        }
        return json;
    }

}