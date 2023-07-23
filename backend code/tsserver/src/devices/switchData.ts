import { device, deviceType, switchData } from '../types'
import data = require('../utility/file_handler')

class SwitchData implements deviceType {
    isOn: boolean

    constructor(isOn = false) {
        this.isOn = isOn
    }
    static loadFromFile(uuid: string, dataPlace: number) {
        return new Promise<switchData>((resolve, reject) => {
            data.readFile<device>(`devices/${uuid}`).then(acData => {
                let data = acData.deviceData[dataPlace]
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

    setVar(varChanged: string, newValue: any,dataIndex = 0): string {
        if(varChanged.substring(0, 4).includes("data")) {
            if( dataIndex == parseInt(varChanged.substring(4))){
                this.defaultUpdateFunction("non",newValue,dataIndex)
            }
        }
        switch (varChanged) {
            case ("isOn"): {
                this.isOn = newValue == 1 ? true : false;
                return "isOn"
            }
            default: {
                throw new Error("variable not found")
            }
        }
    }
    defaultUpdateFunction (topic: string, message: JSON,dataIndex:number) :void{
        let keys: Array<string> = Object.keys(message)

        keys.forEach(key => {
            let newVal = JSON.parse(JSON.stringify(message))[key]
            try {
                this.setVar(key, newVal,dataIndex)
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