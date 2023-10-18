#ifndef Switch_h
#define Switch_h

class Switch
{
private:
    bool isOn;

public:
    Switch();
    bool getIsOn();
    void setIsOn(bool newIsOn);
};
#endif