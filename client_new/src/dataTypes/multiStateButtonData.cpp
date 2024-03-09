#include "multiStateButtonData.h"

MultiStateButtonData::MultiStateButtonData(int _dataId)
{
    typeId = 2;
    dataId = _dataId;
    value = 0;
    mqttTopic = "\0";
}

void MultiStateButtonData::setData(int newValue, bool updateHardware, bool updateServer)
{
    if (value != newValue)
    {
        value = newValue;
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

void MultiStateButtonData::getData(int *intPointer)
{
    *intPointer = value;
}
