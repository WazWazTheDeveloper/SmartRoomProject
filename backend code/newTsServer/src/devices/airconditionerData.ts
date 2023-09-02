import { AirconditionerDataType, IDeviceData } from "./deviceData.interface";
import data = require('../handlers/file_handler')
import { DeviceType } from "../interfaces/device.interface";

class AirconditionerData implements IDeviceData {
    readonly MODE_AUTO = 0;
    readonly MODE_COOL = 1;
    readonly MODE_DRY = 2;
    readonly MODE_HEAT = 3;
    readonly MODE_FAN = 4;

    // speed
    readonly SPEED_LOW = 0;
    readonly SPEED_MED = 1;
    readonly SPEED_HIGH = 2;
    readonly SPEED_AUTO = 3;

    isOn: Boolean
    temp: 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32
    mode: 0 | 1 | 2 | 3 | 4
    speed: 0 | 1 | 2 | 3
    swing1: Boolean
    swing2: Boolean
    timer: number
    // fullhours: number
    // isHalfHour: Boolean
    isStrong: Boolean
    isFeeling: Boolean
    isSleep: Boolean
    isScreen: Boolean
    isHealth: Boolean

    constructor(
        isOn?: Boolean,
        temp?: 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32,
        mode?: 0 | 1 | 2 | 3 | 4,
        speed?: 0 | 1 | 2 | 3,
        swing1?: Boolean,
        swing2?: Boolean,
        timer?: number,
        isStrong?: Boolean,
        isFeeling?: Boolean,
        isSleep?: Boolean,
        isScreen?: Boolean,
        isHealth?: Boolean) {

        if (isOn) {
            this.isOn = isOn
        }
        else {
            this.isOn = false
        }
        if (temp) {
            this.temp = temp
        }
        else {
            this.temp = 24
        }
        if (mode) {
            this.mode = mode
        }
        else {
            this.mode = this.MODE_AUTO
        }
        if (speed) {
            this.speed = speed
        }
        else {
            this.speed = this.SPEED_AUTO
        }
        if (swing1) {
            this.swing1 = swing1
        }
        else {
            this.swing1 = false
        }
        if (swing2) {
            this.swing2 = swing2
        }
        else {
            this.swing2 = false
        }
        if (timer) {
            this.timer = timer
            // this.fullhours = 0
            // this.isHalfHour = false
        }
        else {
            this.timer = 0
            // this.fullhours = 0
            // this.isHalfHour = false
        }
        if (isStrong) {
            this.isStrong = isStrong

        }
        else {
            this.isStrong = false

        }
        if (isFeeling) {
            this.isFeeling = isFeeling

        }
        else {
            this.isFeeling = false

        }
        if (isSleep) {
            this.isSleep = isSleep

        }
        else {
            this.isSleep = false

        }
        if (isScreen) {
            this.isScreen = isScreen

        }
        else {
            this.isScreen = true

        }
        if (isHealth) {
            this.isHealth = isHealth

        }
        else {
            this.isHealth = false

        }

        this.setData = this.setData.bind(this);
        this.setVar = this.setVar.bind(this);
        this.getAsJson = this.getAsJson.bind(this);
        this.getData = this.getData.bind(this);
        this.getVar = this.getVar.bind(this);
    }

    static createFromJson(data:AirconditionerDataType) : AirconditionerData {
        let DeviceData = new AirconditionerData(
            data.isOn,
            data.temp,
            data.mode,
            data.speed,
            data.swing1,
            data.swing2,
            data.timer,
            data.isStrong,
            data.isFeeling,
            data.isSleep,
            data.isScreen,
            data.isHealth)

            return DeviceData;
    }

    getAsJson(): AirconditionerDataType {
        let json: AirconditionerDataType = {
            "isOn": this.isOn,
            "temp": this.temp,
            "mode": this.mode,
            "speed": this.speed,
            "swing1": this.swing1,
            "swing2": this.swing2,
            "timer": this.timer,
            // "fullhours": this.fullhours,
            // "isHalfHour": this.isHalfHour,
            "isStrong": this.isStrong,
            'isFeeling': this.isFeeling,
            "isSleep": this.isSleep,
            "isScreen": this.isScreen,
            "isHealth": this.isHealth
        }
        return json;
    }

    static loadFromFile(uuid: string, dataPlace: number): Promise<AirconditionerData> {
        return new Promise<AirconditionerData>((resolve, reject) => {
            data.readFile<DeviceType>(`devices/${uuid}`).then(acData => {
                let data = acData.deviceData[dataPlace].data;
                let newAirconditionerDevice = new AirconditionerData(
                    data.isOn,
                    data.temp,
                    data.mode,
                    data.speed,
                    data.swing1,
                    data.swing2,
                    data.timer,
                    data.isStrong,
                    data.isFeeling,
                    data.isSleep,
                    data.isScreen,
                    data.isHealth
                )

                resolve(newAirconditionerDevice)
            }).catch(err => {
                console.log("File read failed:", err);
                reject(err);
            });

        });
    }

    // TODO: probably dont need it as you always want to send full data
    getData(event: string) {
        if (event.substring(0, 4).includes("data")) {
            return this.getAsJson()
        }
        switch (event) {
            case ("isOn"): {
                return { "isOn": this.isOn };
            }
            case ("temp"): {
                return { "temp": this.temp };
            }
            case ("speed"): {
                return { "speed": this.speed };
            }
            case ("swing1"): {
                return { "swing1": this.swing1 };
            }
            case ("swing2"): {
                return { "swing2": this.swing2 };
            }
            case ("timer"): {
                return { "timer": this.timer };
            }
            // case ("fullhours"): {
            //     return { "fullhours": this.fullhours };
            // }
            // case ("isHalfHour"): {
            //     return { "isHalfHour": this.isHalfHour };
            // }
            case ("isStrong"): {
                return { "isStrong": this.isStrong };
            }
            case ("isFeeling"): {
                return { "isFeeling": this.isFeeling };
            }
            case ("isSleep"): {
                return { "isSleep": this.isSleep };
            }
            case ("isScreen"): {
                return { "isScreen": this.isScreen };
            }
            case ("isHealth"): {
                return { "isHealth": this.isHealth };
            }
        }
    }

    getVar(varName:string) {
        switch (varName) {
            case ("isOn"): {
                return this.isOn
            }
            case ("temp"): {
                return this.temp
            }
            case ("speed"): {
                return this.speed
            }
            case ("swing1"): {
                return this.swing1
            }
            case ("swing2"): {
                return this.swing2
            }
            case ("timer"): {
                return this.timer
            }
            // case ("fullhours"): {
            //     return this.fullhours
            // }
            // case ("isHalfHour"): {
            //     return this.isHalfHour
            // }
            case ("isStrong"): {
                return this.isStrong
            }
            case ("isFeeling"): {
                return this.isFeeling
            }
            case ("isSleep"): {
                return this.isSleep
            }
            case ("isScreen"): {
                return this.isScreen
            }
            case ("isHealth"): {
                return this.isHealth
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

    setVar(varName: string, newValue: any) {
        switch (varName) {
            case ("isOn"): {
                this.isOn = newValue == 1 ? true : false;
                return
            }
            case ("temp"): {
                if (!isNaN(newValue)) {
                    let newTemp = parseInt(newValue);
                    if (newTemp < 16) {
                        this.temp = 16;
                    }
                    if (newTemp > 32) {
                        this.temp = 32
                    }
                    else {
                        // @ts-ignore
                        this.temp = newTemp
                    }
                    return
                }
            }
            case ("mode"): {
                if (!isNaN(newValue)) {
                    let newMode = parseInt(newValue);
                    if (newMode < 0) {
                        this.mode = 0;
                    }
                    if (newMode > 4) {
                        this.mode = 4
                    }
                    else {
                        // @ts-ignore
                        this.mode = newMode
                    }
                    return
                }
            }
            case ("speed"): {
                if (!isNaN(newValue)) {
                    let newSpeed = parseInt(newValue);
                    switch (newSpeed) {
                        case (0): {
                            this.speed = newSpeed;
                            break;
                        } 
                        case (1): {
                            this.speed = newSpeed;
                            break;
                        } 
                        case (2): {
                            this.speed = newSpeed;
                            break;
                        } 
                        case (3): {
                            this.speed = newSpeed;
                            break;
                        }
                    }

                    return
                }
            }
            case ("swing1"): {
                this.swing1 = newValue == 1 ? true : false;;
                return
            }
            case ("swing2"): {
                this.swing2 = newValue == 1 ? true : false;;
                    return
            }
            case ("timer"): {
                if(!isNaN(newValue)){
                    this.timer = newValue
                    return
                }
            }
            case ("isStrong"): {
                this.isStrong = newValue == 1 ? true : false;;
                    return
            }
            case ("isFeeling"): {
                this.isFeeling = newValue == 1 ? true : false;;
                    return
            }
            case ("isSleep"): {
                this.isSleep = newValue == 1 ? true : false;;
                    return
            }
            case ("isScreen"): {
                this.isScreen = newValue == 1 ? true : false;;
                    return
            }
            case ("isHealth"): {
                this.isHealth = newValue == 1 ? true : false;;
                    return
            }
            default: {
                throw new Error("variable not found")
                return
            }
        }

    }
}

export {AirconditionerData}