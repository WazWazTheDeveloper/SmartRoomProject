#ifndef SwitchType_h
#define SwitchType_h
#include <ArduinoJson.h>
#include "DeviceData.h"
#include "Switch.h"

class SwitchType : public DeviceData {
    private:
        Switch *switchObj;
    public:
        SwitchType(int dataType, int dataAt);
        bool setData(JsonObject &data);
        bool updateData(JsonObject &data);
        void getData(JsonObject data);
};
#endif