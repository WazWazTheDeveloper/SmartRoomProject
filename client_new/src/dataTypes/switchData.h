#ifndef SwitchData_h
#define SwitchData_h
#include "DataObject.h"

class SwitchData : public DataObject {
    private:
        bool isOn;
    public:
        SwitchData(int dataId);
        void setData(bool newState);
        void getData(bool& boolPointer);
};
#endif