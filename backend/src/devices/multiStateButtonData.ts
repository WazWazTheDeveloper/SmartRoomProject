import { DeviceType } from "../interfaces/device.interface";
import { IDeviceData, MultiStateButtonDataType, stateItem} from "./deviceData.interface";
import data = require('../handlers/file_handler')


export default class MultiStateButtonData implements IDeviceData {

    currentState : number
    stateList : stateItem[]
    constructor(currentState : number = 0, stateList : stateItem[] = []) {
        this.currentState = currentState
        this.stateList = stateList

        this.setData = this.setData.bind(this);
        this.setVar = this.setVar.bind(this);
        this.getAsJson = this.getAsJson.bind(this);
        this.getData = this.getData.bind(this);
        this.getVar = this.getVar.bind(this);
    }

    static createFromJson(data: MultiStateButtonDataType): MultiStateButtonData {
        let DeviceData = new MultiStateButtonData(
            data.currentState,
            data.stateList
            )

        return DeviceData;
    }

    static loadFromFile(uuid: string, dataPlace: number) {
        return new Promise<MultiStateButtonDataType>((resolve, reject) => {
            data.readFile<DeviceType>(`devices/${uuid}`).then(deviceJson => {
                let data = deviceJson.deviceData[dataPlace].data
                let newNumberDevice = new MultiStateButtonData(
                    data.currentState,
                    data.stateList
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
            case ("currentState"): {
                this.currentState = newValue
                return "currentState"
            }
            case ("addState"): {
                this.addState(newValue);
                return "addState"
            }
            case ("removeState"): {
                this.removeState(newValue);
                return "removeState"
            }
            case ("updateState"): {
                this.updateState(newValue);
                return "updateState"
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
            case ("currentState"): {
                return { "currentState": this.currentState };
            }
            case ("stateList"): {
                return { "stateList": this.stateList };
            }
        }
    }

    getAsJson() {
        let json = {
            "currentState": this.currentState,
            // WARN: this may cause a problm when sending data to the esp, check later
            "stateList": this.stateList,
        }
        return json;
    }

    getVar(varName: string) {
        switch (varName) {
            case ("currentState"): {
                return this.currentState
            }
            case ("stateList"): {
                return this.stateList
            }
        }
    }

    // 
    addState(newState : stateItem) {
        if(
            !(typeof newState.icon == "string") ||
            !(typeof newState.isIcon == "boolean") ||
            !(typeof newState.stateNumber == "number") ||
            !(typeof newState.string == "string")
        ) {
            return
        }

        for (let index = 0; index < this.stateList.length; index++) {
            const state = this.stateList[index];
            if(state.stateNumber == newState.stateNumber) {
                return
            }
        }

        this.stateList.push(newState);
    }

    removeState(stateNumber:number) {
        if(!(typeof stateNumber == "number")) return

        for (let index = 0; index < this.stateList.length; index++) {
            const state = this.stateList[index];
            if(state.stateNumber == stateNumber) {
                this.stateList.splice(stateNumber,1)
            }
        }
    }

    updateState(updatedState : stateItem) {
        if(
            !(typeof updatedState.icon == "string") ||
            !(typeof updatedState.isIcon == "boolean") ||
            !(typeof updatedState.stateNumber == "number") ||
            !(typeof updatedState.string == "string")
        ) {
            return
        }

        for (let index = 0; index < this.stateList.length; index++) {
            const state = this.stateList[index];
            if(state.stateNumber == updatedState.stateNumber) {
                state.icon = updatedState.icon;
                state.isIcon = updatedState.isIcon;
                state.string = updatedState.string;
            }
        }
    }
}