#ifndef DeviceData_h
#define DeviceData_h
#include <ArduinoJson.h>

class DeviceData {
    using callbackType = void (*) (int dataAt,int dataType);
    // static int AIRCONDITIONER_TYPE = 0;
    // static int SWITCH_TYPE = 1;
    protected:
        int dataType;
        int dataAt;
        callbackType callback;
    public:
        DeviceData();
        virtual bool setData(JsonObject &data);
        virtual bool updateData(JsonObject &data);
        virtual void getData(JsonObject data);
        virtual int getDataType();
        virtual int getDataAt();
        virtual void setCallback(callbackType callback);
};
#endif
