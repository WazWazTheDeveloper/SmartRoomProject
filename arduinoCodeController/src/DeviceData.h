#ifndef DeviceData_h
#define DeviceData_h
#include <ArduinoJson.h>

class DeviceData {
    // static int AIRCONDITIONER_TYPE = 0;
    // static int SWITCH_TYPE = 1;
    protected:
        int dataType;
        int dataAt;
    public:
        DeviceData();
        virtual bool setData(JsonObject &data);
        virtual void getData();
        virtual int getDataType();
        virtual int getDataAt();
};
#endif
