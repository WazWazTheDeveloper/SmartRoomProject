import { airconditionerData, device, deviceType } from '../types'
import data = require('../../utility/file_handler')

class AirconditionerData implements deviceType {
    // modes
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
    fullhours: number
    isHalfHour: Boolean
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
        isHealth?: Boolean,
        callbackOnchange?: Function) {

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
            this.fullhours = 0
            this.isHalfHour = false
        }
        else {
            this.timer = 0
            this.fullhours = 0
            this.isHalfHour = false
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
    }

    getAsJson(): airconditionerData {
        let json: airconditionerData = {
            "isOn": this.isOn,
            "temp": this.temp,
            "mode": this.mode,
            "speed": this.speed,
            "swing1": this.swing1,
            "swing2": this.swing2,
            "timer": this.timer,
            "fullhours": this.fullhours,
            "isHalfHour": this.isHalfHour,
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
            data.readFile<device>(`devices/${uuid}`).then(acData => {
                let data = acData.deviceData[dataPlace]
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

    defaultUpdateFunction(topic: string, message: string): void {
        //TODO: add a check to check if data is of tape airconditioner and then update the file
        console.log(message);
    }

    //TODO: fix this shit
    setVar(varChanged: string, newValue: any): string {
        switch (varChanged) {
            // TODO: add checks to add types when setting variables
            case ("isOn"): {
                this.isOn = newValue;
                return "isOn"
            }
            case ("temp"): {
                this.temp = newValue;
                return "temp"
            }
            case ("speed"): {
                this.speed = newValue;
                return "speed"
            }
            case ("swing1"): {
                this.swing1 = newValue;
                return "swing1"
            }
            case ("swing2"): {
                this.swing2 = newValue;
                return "swing2"
            }
            case ("timer"): {
                //WARN: need to add a check here to check for full hours and halfs
                this.timer = newValue;
                return "timer"
            }
            case ("fullhours"): {
                //WARN delete this later
                this.fullhours = newValue;
                return "fullhours"
            }
            case ("isHalfHour"): {
                //WARN delete this later
                this.isHalfHour = newValue;
                return "isHalfHour"
            }
            case ("isStrong"): {
                this.isStrong = newValue;
                return "isStrong"
            }
            case ("isFeeling"): {
                this.isFeeling = newValue;
                return "isFeeling"
            }
            case ("isSleep"): {
                this.isSleep = newValue;
                return "isSleep"
            }
            case ("isScreen"): {
                this.isScreen = newValue;
                return "isScreen"
            }
            case ("isHealth"): {
                this.isHealth = newValue;
                return "isHealth"
            }
            default: {
                throw new Error("variable not found")
            }
        }

    }
}

export { AirconditionerData }