#include "LivingRoomAcDataType.h"
#include "LivingRoomAcRemote.h"
#include <ArduinoJson.h>

LivingRoomAcDataType::LivingRoomAcDataType(int _dataType, int _dataAt) : acRemote(new LivingRoomAcRemote())
{
    dataAt = _dataAt;
    dataType = _dataType;
    acRemote->begin();
}

int LivingRoomAcDataType::getDataAt()
{
    return dataAt;
}

int LivingRoomAcDataType::getDataType()
{
    return dataType;
}

bool LivingRoomAcDataType::setData(JsonObject &data)
{
    bool isOn = data["isOn"];             // false
    int temp = data["temp"];              // 24
    int mode = data["mode"];              // 0
    int speed = data["speed"];            // 3
    bool swing1 = data["swing1"];         // false
    int timer1 = data["timer"];            // 0
    int timer2 = data["timer"];            // 0
    // int fullhours = data["fullhours"];    // 0
    // bool isHalfHour = data["isHalfHour"]; // false
    bool isStrong = data["isStrong"];     // false
    bool isSleep = data["isSleep"];       // false
    // bool isScreen = data["isScreen"];     // true

    acRemote->setIsOn(isOn)
        .setTemp(temp)
        .setMode(mode)
        .setSpeed(speed)
        .setSwing1(swing1)
        .setTimer1(timer1)
        .setTimer2(timer2)
        .setIsStrong(isStrong)
        .setIsSleep(isSleep)
        .execute();

    return 1;
}

void LivingRoomAcDataType::getData() {

}