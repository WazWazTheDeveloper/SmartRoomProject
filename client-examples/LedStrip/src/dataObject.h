#include "dataTypes/switchData.h"
#include "dataTypes/numberData.h"

#ifndef DataObject_h
#define DataObject_h
#include <ArduinoJson.h>
class DataObject {
    using callbackType = void (*) (int dataAt,int dataType);
    using onSetCallbackType = void (*) (int dataAt,int dataType);
    protected:
        int dataType;
        int dataAt;
        String varName;
        callbackType onUpdateCallback;
        callbackType onSetCallback;
    public:
        DataObject();
        virtual bool setData(JsonObject &data);
        // virtual bool updateData(JsonObject &data);
        virtual bool updateData(bool newState);
        virtual void getData(JsonObject data);
        virtual int getDataType();
        virtual int getDataAt();
        virtual void setOnUpdateCallback(callbackType callback);
        virtual void setOnSetCallback(callbackType callback);

        static const int SWITCH_TYPE = 1;
};
#endif