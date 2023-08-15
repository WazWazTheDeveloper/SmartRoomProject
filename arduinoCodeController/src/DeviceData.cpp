#include "DeviceData.h"

DeviceData::DeviceData()
{
    dataType = -1;
    dataAt = -1;
}

bool DeviceData::setData(JsonObject &data){return false;}
void DeviceData::getData(){}
int DeviceData::getDataType(){return dataType;}
int DeviceData::getDataAt(){return dataType;}
