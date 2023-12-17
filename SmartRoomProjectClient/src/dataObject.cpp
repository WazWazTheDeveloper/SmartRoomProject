#include "DataObject.h"

DataObject::DataObject()
{
    dataType = -1;
    dataAt = -1;
    varName = "";
}

bool DataObject::setData(JsonObject &data){return 1;}
// bool DataObject::updateData(JsonObject &data){return 1;}
bool DataObject::updateData(bool newState){return 1;}
int DataObject::getDataType(){return dataType;}
int DataObject::getDataAt(){return dataAt;}
void DataObject::setOnUpdateCallback(callbackType newCallback){onUpdateCallback = newCallback;}
void DataObject::setOnSetCallback(callbackType newCallback){onSetCallback = newCallback;}
void DataObject::getData(JsonObject data){};
