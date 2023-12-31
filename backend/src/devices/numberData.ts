import { DeviceType } from "../interfaces/device.interface";
import { IDeviceData, NumberDataType } from "./deviceData.interface";
import data = require('../handlers/file_handler')

export default class NumberData implements IDeviceData {
    iconName: string
    number: Number
    isSensor: boolean
    minVal: number
    maxVal: number
    jumpVal: number
    symbol: string

    constructor(
        number: Number = 0,
        isSensor: boolean = false,
        minVal: number = 0,
        maxVal: number = 100,
        jumpVal: number = 1,
        iconName: string = "",
        symbol: string = ""
    ) {
        this.iconName = iconName
        this.number = number;
        this.isSensor = isSensor;
        this.minVal = minVal;
        this.maxVal = maxVal;
        this.jumpVal = jumpVal;
        this.symbol = symbol;

        this.setData = this.setData.bind(this);
        this.setVar = this.setVar.bind(this);
        this.getAsJson = this.getAsJson.bind(this);
        this.getData = this.getData.bind(this);
        this.getVar = this.getVar.bind(this);
    }

    static createFromJson(data: NumberDataType): NumberData {
        let DeviceData = new NumberData(
            data.number,
            data.isSensor,
            data.minVal,
            data.maxVal,
            data.jumpVal,
            data.iconName,
            data.symbol
        )

        return DeviceData;
    }

    static loadFromFile(uuid: string, dataPlace: number) {
        return new Promise<NumberDataType>((resolve, reject) => {
            data.readFile<DeviceType>(`devices/${uuid}`).then(deviceJson => {
                let data = deviceJson.deviceData[dataPlace].data
                let newNumberDevice = new NumberData(
                    data.number,
                    data.isSensor,
                    data.minVal,
                    data.maxVal,
                    data.jumpVal,
                    data.iconName,
                    data.symbol
                )

                resolve(newNumberDevice)
            }).catch(err => {
                console.log("File read failed:", err);
                reject(err);
            });

        });
    };

    setVar(varName: string, newValue: any): string {
        switch (varName) {
            case ("iconName"): {
                this.iconName = newValue
                return "iconName"
            }
            case ("number"): {
                // TODO: check if new val is multiple of jumpval and in between minval and maxval
                this.number = newValue
                return "number"
            }
            case ("isSensor"): {
                this.isSensor = newValue
                return "isSensor"
            }
            case ("minVal"): {
                this.minVal = newValue
                return "minVal"
            }
            case ("maxVal"): {
                this.maxVal = newValue
                return "maxVal"
            }
            case ("jumpVal"): {
                this.jumpVal = newValue
                return "jumpVal"
            } 
            case ("symbol"): {
                this.symbol = newValue
                return "symbol"
            }
            default: {
                throw new Error("variable not found")
            }
        }
    }

    setData(newData: any) {
        let keys: Array<string> = Object.keys(newData)
        keys.forEach(key => {
            let newVal = JSON.parse(JSON.stringify(newData))[key]
            try {
                this.setVar(key, newVal)
            } catch (err) {
                //its fine :)
            }
        });
    }

    getData(event: string) {
        if (event.substring(0, 4).includes("data")) {
            return this.getAsJson()
        }
        switch (event) {
            case ("iconName"): {
                return { "iconName": this.iconName };
            }
            case ("number"): {
                return { "number": this.number };
            }
            case ("isSensor"): {
                return { "isSensor": this.isSensor };
            }
            case ("minVal"): {
                return { "minVal": this.minVal };
            }
            case ("maxVal"): {
                return { "maxVal": this.maxVal };
            }
            case ("jumpVal"): {
                return { "jumpVal": this.jumpVal };
            }
            case ("symbol"): {
                return { "symbol": this.symbol };
            }
        }
    }

    getAsJson() {
        let json: NumberDataType = {
            "iconName": this.iconName,
            "number": this.number,
            "isSensor": this.isSensor,
            "minVal": this.minVal,
            "maxVal": this.maxVal,
            "jumpVal": this.jumpVal,
            "symbol": this.symbol,
        }
        return json;
    }

    getVar(varName: string) {
        switch (varName) {
            case ("iconName"): {
                return this.iconName
            }
            case ("number"): {
                return this.number
            }
            case ("isSensor"): {
                return this.isSensor
            }
            case ("minVal"): {
                return this.minVal
            }
            case ("maxVal"): {
                return this.maxVal
            }
            case ("jumpVal"): {
                return this.jumpVal
            }
            case ("symbol"): {
                return this.symbol
            }
        }
    }
}