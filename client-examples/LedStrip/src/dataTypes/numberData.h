#ifndef NumberData_h
#define NumberData_h
#include "DataObject.h"

class NumberData : public DataObject
{
private:
    int value;

public:
    NumberData(int _dataId);
    void setData(int newValue,bool updateHardware, bool updateServer);
    void getData(int *intPointer);
};
#endif