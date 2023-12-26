#ifndef SwitchData_h
#define SwitchData_h
#include "DataObject.h"

class SwitchData : public DataObject {
    public:
        bool isOn;
        SwitchData(int dataType, int dataAt, char* _varName);
        bool setData(JsonObject &data);
        bool updateData(bool newState);
        void getData(JsonObject data);
};
#endif