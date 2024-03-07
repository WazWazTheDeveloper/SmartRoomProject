#include "DataObject.h"
DataObject::DataObject()
{
    typeId = -1;
    dataId = -1;
    mqttTopic = {"\0"};
}

int DataObject::getTypeId() {return typeId;};
int DataObject::getDataId() {return dataId;};

void DataObject::setTopic(char* newTopic) {return;};
void DataObject::setData(bool newState) {return;};
void DataObject::setData(int newValue) {return;};

void DataObject::getData(int& intPointer){};
void DataObject::getData(bool& boolPointer){};