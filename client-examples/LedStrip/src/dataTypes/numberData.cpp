#include "numberData.h"

NumberData::NumberData(int _dataType, int _dataAt, char *_varName)
{
    dataAt = _dataAt;
    dataType = _dataType;
    varName = _varName;
    value = 0;
}

bool NumberData::setData(JsonObject &data)
{
    value = data[varName].as<u_int8_t>();
    onSetCallback(dataAt, dataType);
    return 1;
}

int NumberData::updateData(int newValue)
{
    if (value != newValue)
    {
        value  = newValue;
        onUpdateCallback(dataAt, dataType);
        return 1;
    }
    return 0;
}

void NumberData::getData(JsonObject data)
{
    data[varName] = value;
}