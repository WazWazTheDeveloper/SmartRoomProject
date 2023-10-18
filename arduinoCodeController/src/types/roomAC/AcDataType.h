#ifndef AcDataType_h
#define AcDataType_h
#include <ArduinoJson.h>
#include "AcRemote.h"
#include "DeviceData.h"

class AcDataType : public DeviceData {
    private:
        AcRemote *acRemote;
    public:
        AcDataType(int dataType, int dataAt);
        bool setData(JsonObject &data);
};
#endif