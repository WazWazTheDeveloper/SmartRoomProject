import { DeviceType } from "../interfaces/device.interface";
import { IDeviceData, SwitchDataType } from "./deviceData.interface";
import data = require('../handlers/file_handler')

class SwitchData implements IDeviceData {
    iconName:string
    isOn: boolean
    onName:string
    offName:string
    isSensor: boolean

    constructor(isOn = false,onName:string = "ON",offName:string ="OFF",isSensor = true,iconName: string = "") {
        this.iconName = iconName
        this.isOn = isOn
        this.isSensor = isSensor

        this.setData = this.setData.bind(this);
        this.setVar = this.setVar.bind(this);
        this.getAsJson = this.getAsJson.bind(this);
        this.getData = this.getData.bind(this);
        this.getVar = this.getVar.bind(this);
        this.onName=onName;
        this.offName=offName;
    }

    static createFromJson(data:SwitchDataType) : SwitchData {
        let DeviceData = new SwitchData(
            data.isOn,
            data.onName,
            data.offName,
            data.isSensor,
            data.iconName)

            return DeviceData;
    }
    
    static loadFromFile(uuid: string, dataPlace: number) {
        return new Promise<SwitchDataType>((resolve, reject) => {
            data.readFile<DeviceType>(`devices/${uuid}`).then(acData => {
                let data = acData.deviceData[dataPlace].data
                let newAirconditionerDevice = new SwitchData(
                    data.isOn,
                    data.onName,
                    data.offName,
                    data.isSensor,
                    data.iconName
                )

                resolve(newAirconditionerDevice)
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
            case ("isOn"): {
                this.isOn = newValue == 1 ? true : false;
                return "isOn"
            }
            case ("onName"): {
                this.onName = newValue;
                return "onName"
            }
            case ("offName"): {
                this.offName = newValue;
                return "offName"
            }
            case ("isSensor"): {
                this.isSensor = newValue;
                return "isSensor"
            }
            default: {
                throw new Error("variable not found")
            }
        }
    }

    setData(newData : any) {
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

    getData (event: string) {
        if (event.substring(0, 4).includes("data")) {
            return this.getAsJson()
        }
        switch (event) {
            case ("iconName"): {
                return { "iconName": this.iconName };
            }
            case("isOn"): {
                return { "isOn": this.isOn };
            }
            case("onName"): {
                return { "onName": this.onName };
            }
            case("offName"): {
                return { "offName": this.offName };
            }
            case("isSensor"): {
                return { "isSensor": this.isSensor };
            }
        }
    }
    getAsJson () {
        let json : SwitchDataType = {
            "iconName": this.iconName,
            "isOn": this.isOn,
            "onName": this.onName,
            "offName": this.offName,
            "isSensor": this.isSensor
        }
        return json;
    }
    getVar(varName:string) {
        switch (varName) {
            case ("iconName"): {
                return this.iconName
            }
            case ("isOn"): {
                return this.isOn
            }
            case ("onName"): {
                return this.onName
            }
            case ("offName"): {
                return this.offName
            }
            case ("isSensor"): {
                return this.isSensor
            }
        }
    }

}

export {SwitchData}