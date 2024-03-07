#include "SwitchData.h"

SwitchData::SwitchData(int dataId)
{
    typeId = 0;
    dataId = dataId;
    isOn = false;
}

void SwitchData::setData(bool newState)
{
    if (isOn != newState)
    {
        isOn = newState;
        // onUpdateCallback(dataAt, dataType);
    }
}

void SwitchData::getData(bool &boolPointer)
{
    boolPointer = isOn;
}
