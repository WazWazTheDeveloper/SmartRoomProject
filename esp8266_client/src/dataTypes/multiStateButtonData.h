#ifndef MultiStateButtonData_h
#define MultiStateButtonData_h
#include "DataObject.h"

class MultiStateButtonData : public DataObject
{
private:
    int value;

public:
    MultiStateButtonData(int _dataId);
    void setData(int newValue,bool updateHardware, bool updateServer);
    void getData(int *intPointer);
};
#endif