#ifndef SwitchData_h
#define SwitchData_h
#include "DataObject.h"

class SwitchData : public DataObject
{
private:
    bool isOn;

public:
    SwitchData(int _dataId);
    void setData(bool newState,bool updateHardware, bool updateServer);
    void getData(bool *boolPointer);
};
#endif