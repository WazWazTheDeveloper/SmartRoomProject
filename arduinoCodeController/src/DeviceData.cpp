#include "DeviceData.h"

DeviceData::DeviceData()
{
    dataType = -1;
    dataAt = -1;
}

bool DeviceData::setData(JsonObject &data){return 1;}
bool DeviceData::updateData(JsonObject &data){return 1;}
int DeviceData::getDataType(){return dataType;}
int DeviceData::getDataAt(){return dataAt;}
void DeviceData::setCallback(callbackType newCallback){callback = newCallback;}
void DeviceData::getData(JsonObject data){};
