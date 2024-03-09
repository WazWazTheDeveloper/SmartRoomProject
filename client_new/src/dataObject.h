#include <Arduino.h>

#ifndef DataObject_h
#define DataObject_h
class DataObject
{
    using updateServerCallback = void (*)(int dataId);   // ?
    using updateHardwareCallback = void (*)(int dataId); // ?

protected:
    int typeId;
    int dataId;
    char *mqttTopic;
    updateServerCallback updateServerFunc;
    updateHardwareCallback updateHardwareFunc;

public:
    DataObject();

    // setters
    void setTopic(char *newTopic);
    virtual void setData(bool newState,bool updateHardware, bool updateServer);
    virtual void setData(int newValue,bool updateHardware, bool updateServer);
    virtual void setUpdateServer(updateServerCallback callback);
    virtual void setupdateHardware(updateHardwareCallback callback);

    // getters
    void getTopic(char *topicPointer);
    virtual void getData(int *intPointer);
    virtual void getData(bool *boolPointer);
    virtual int getTypeId();
    virtual int getDataId();
};
#endif