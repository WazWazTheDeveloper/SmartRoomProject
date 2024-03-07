#ifndef DataObject_h
#define DataObject_h
class DataObject {
    protected:
        int typeId;
        int dataId;
        char* mqttTopic;
    public:
        DataObject();

        // setters
        virtual void setTopic(char* newTopic);
        virtual void setData(bool newState);
        virtual void setData(int newValue);

        //getters
        virtual void getData(int& intPointer);
        virtual void getData(bool& boolPointer);
        virtual int getTypeId();
        virtual int getDataId();
};
#endif