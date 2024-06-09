#include "SwitchData.h"

SwitchData::SwitchData(int _dataId)
{
    typeId = 0;
    dataId = _dataId;
    isOn = false;
    mqttTopic[0] = '\0';
}

void SwitchData::setData(bool newState, bool updateHardware, bool updateServer)
{
    if (isOn != newState)
    {
        isOn = newState;
        if (updateHardware)
        {
            updateHardwareFunc(dataId);
        }
        if (updateServer)
        {
            updateServerFunc(dataId);
        }
    }
}

void SwitchData::getData(bool *boolPointer)
{
    *boolPointer = isOn;
}
