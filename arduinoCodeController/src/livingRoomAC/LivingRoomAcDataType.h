#ifndef LivingRoomAcDataType_h
#define LivingRoomAcDataType_h
#include <ArduinoJson.h>
#include "LivingRoomAcRemote.h"
#include "DeviceData.h"

class LivingRoomAcDataType : public DeviceData {
    private:
        LivingRoomAcRemote *acRemote;
    public:
        LivingRoomAcDataType(int dataType, int dataAt);
        int getDataType();
        int getDataAt();
        bool setData(JsonObject &data);
        void getData();
};
#endif