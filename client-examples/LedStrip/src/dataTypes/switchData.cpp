#include "SwitchData.h"

SwitchData::SwitchData(int _dataType, int _dataAt, char *_varName)
{
    dataAt = _dataAt;
    dataType = _dataType;
    varName = _varName;
    isOn = false;
}

bool SwitchData::setData(JsonObject &data)
{
    isOn = data[varName];
    onSetCallback(dataAt, dataType);
    return 1;
}

bool SwitchData::updateData(bool newState)
{
    if (isOn != newState)
    {
        isOn = newState;
        onUpdateCallback(dataAt, dataType);
        return 1;
    }
    return 0;
}

void SwitchData::getData(JsonObject data)
{
    data[varName] = isOn;
}