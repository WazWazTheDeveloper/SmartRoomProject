import { DeviceType } from "../interfaces/device.interface";
import { IDeviceData, SwitchDataType } from "./deviceData.interface";
import data = require('../handlers/file_handler')

class SwitchData implements IDeviceData {
    isOn: boolean

    constructor(isOn = false) {
        this.isOn = isOn

        this.setData = this.setData.bind(this);
        this.setVar = this.setVar.bind(this);
        this.getAsJson = this.getAsJson.bind(this);
        this.getData = this.getData.bind(this);
        this.getVar = this.getVar.bind(this);
    }
    static loadFromFile(uuid: string, dataPlace: number) {
        return new Promise<SwitchDataType>((resolve, reject) => {
            data.readFile<DeviceType>(`devices/${uuid}`).then(acData => {
                let data = acData.deviceData[dataPlace].data
                let newAirconditionerDevice = new SwitchData(
                    data.isOn
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
            case ("isOn"): {
                this.isOn = newValue == 1 ? true : false;
                return "isOn"
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
            case("isOn"): {
                return { "isOn": this.isOn };
            }
        }
    }
    getAsJson () {
        let json = {
            "isOn": this.isOn
        }
        return json;
    }
    getVar(varName:string) {
        switch (varName) {
            case ("isOn"): {
                return this.isOn
            }
        }
    }

}

export {SwitchData}