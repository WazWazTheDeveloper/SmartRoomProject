interface SettingsType {
}

class Settings {

    constructor() {

    }

    getAsJson():SettingsType {
        let dataJson: SettingsType = {
        }

        return dataJson
    }

    public static getFromJson(json:SettingsType) {
        let settings = new Settings();
        return settings
    }

    getDefaultSettings(){

    }
}

export {Settings,SettingsType}