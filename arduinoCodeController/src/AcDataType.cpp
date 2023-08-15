#include "AcDataType.h"
#include "AcRemote.h"
#include <ArduinoJson.h>

AcDataType::AcDataType(int _dataType, int _dataAt) : acRemote(new AcRemote())
{
    dataAt = _dataAt;
    dataType = _dataType;
    acRemote->begin();
}

int AcDataType::getDataAt()
{
    return dataAt;
}

int AcDataType::getDataType()
{
    return dataType;
}

bool AcDataType::setData(JsonObject &data)
{
    bool isOn = data["isOn"];             // false
    int temp = data["temp"];              // 24
    int mode = data["mode"];              // 0
    int speed = data["speed"];            // 3
    bool swing1 = data["swing1"];         // false
    bool swing2 = data["swing2"];         // false
    int timer = data["timer"];            // 0
    // int fullhours = data["fullhours"];    // 0
    // bool isHalfHour = data["isHalfHour"]; // false
    bool isStrong = data["isStrong"];     // false
    bool isFeeling = data["isFeeling"];   // false
    bool isSleep = data["isSleep"];       // false
    // bool isScreen = data["isScreen"];     // true
    bool isHealth = data["isHealth"];     // false

    acRemote->setIsOn(isOn)
        .setTemp(temp)
        .setMode(mode)
        .setSpeed(speed)
        .setSwing1(swing1)
        .setSwing2(swing2)
        .setTimer(timer)
        .setIsStrong(isStrong)
        .setIsFeeling(isFeeling)
        .setIsSleep(isSleep)
        .setIsHealth(isHealth)
        .execute();

    return 1;
}

void AcDataType::getData() {

}