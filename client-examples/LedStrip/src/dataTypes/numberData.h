#ifndef NumberData_h
#define NumberData_h
#include "DataObject.h"

class NumberData : public DataObject {
    public:
        int value;
        NumberData(int dataType, int dataAt, char* _varName);
        bool setData(JsonObject &data);
        int updateData(int newValue);
        void getData(JsonObject data);
};
#endif