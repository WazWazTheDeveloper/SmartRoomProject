#include "numberData.h"

NumberData::NumberData(int _dataId)
{
    typeId = 1;
    dataId = _dataId;
    value = 0;
    mqttTopic = "\0";
}

void NumberData::setData(int newValue, bool updateHardware, bool updateServer)
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

void NumberData::getData(int *intPointer)
{
    *intPointer = value;
}
