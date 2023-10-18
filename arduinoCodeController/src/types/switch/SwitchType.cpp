#include "SwitchType.h"
#include "Switch.h"
#include <ArduinoJson.h>

SwitchType::SwitchType(int _dataType, int _dataAt) : switchObj(new Switch())
{
    dataAt = _dataAt;
    dataType = _dataType;
}

bool SwitchType::setData(JsonObject &data)
{
    bool isOn = data["isOn"];
    switchObj->setIsOn(isOn);
    return 1;
}

bool SwitchType::updateData(JsonObject &data)
{
    bool newIsOn = data["isOn"];
    if (switchObj->getIsOn() != newIsOn)
    {
        switchObj->setIsOn(newIsOn);
        callback(dataAt, dataType);
        return 1;
    }
    return 0;
}

void SwitchType::getData(JsonObject data)
{
    data["isOn"] = switchObj->getIsOn();
}