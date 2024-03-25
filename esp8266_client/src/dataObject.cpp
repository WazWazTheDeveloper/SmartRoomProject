#include "DataObject.h"
DataObject::DataObject()
{
    typeId = -1;
    dataId = -1;

    // size_t destination_size = 108;
    // snprintf(mqttTopic, destination_size, "%s", "\0");
    // mqttTopic = {"\0"};
}

int DataObject::getTypeId() { return typeId; };
int DataObject::getDataId() { return dataId; };

void DataObject::setTopic(char *newTopic)
{
    size_t destination_size = 108;
    strncpy(mqttTopic,newTopic, destination_size);
};
void DataObject::getTopic(char *topicPointer)
{
    size_t size = 108;
    snprintf(topicPointer, size, "%s", mqttTopic);
};

void DataObject::setData(bool newState, bool updateHardware, bool updateServer) { return; };
void DataObject::setData(int newValue, bool updateHardware, bool updateServer) { return; };

void DataObject::getData(int *intPointer){};
void DataObject::getData(bool *boolPointer){};

void DataObject::setUpdateServer(updateServerCallback newCallback) { updateServerFunc = newCallback; }
void DataObject::setupdateHardware(updateHardwareCallback newCallback) { updateHardwareFunc = newCallback; }