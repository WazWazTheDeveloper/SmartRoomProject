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

    defaultUpdateFunction(topic: string, message: JSON,dataIndex:number): void {
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
            case ("fullhours"): {
                return { "fullhours": this.fullhours };
            }
            case ("isHalfHour"): {
                return { "isHalfHour": this.isHalfHour };
            }
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
                    return "temp"
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

                    return "speed"
                }
            }
            case ("swing1"): {
                this.swing1 = newValue == 1 ? true : false;;
                return "swing1"
            }
            case ("swing2"): {
                this.swing2 = newValue == 1 ? true : false;;
                return "swing2"
            }
            case ("timer"): {
                if(!isNaN(newValue)){
                    this.setTimer(newValue)
                    return "timer"
                }
            }
            case ("isStrong"): {
                this.isStrong = newValue == 1 ? true : false;;
                return "isStrong"
            }
            case ("isFeeling"): {
                this.isFeeling = newValue == 1 ? true : false;;
                return "isFeeling"
            }
            case ("isSleep"): {
                this.isSleep = newValue == 1 ? true : false;;
                return "isSleep"
            }
            case ("isScreen"): {
                this.isScreen = newValue == 1 ? true : false;;
                return "isScreen"
            }
            case ("isHealth"): {
                this.isHealth = newValue == 1 ? true : false;;
                return "isHealth"
            }
            default: {
                throw new Error("variable not found")
            }
        }

    }

    private setTimer(time: number) {
        let fullhours = Math.floor(time);
        if (fullhours <= 9 && fullhours >= 0)
        {
            this.isHalfHour = time%1 == 0 ? false : true;
        }else {
            this.isHalfHour = false;
        }
    }
}

export { AirconditionerData }