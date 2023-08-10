#ifndef AcRemote_h
#define AcRemote_h
#include "Arduino.h"
#include <IRremoteESP8266.h>
#include <IRsend.h>

// #include <string>

class AcRemote
{
private:
    const uint16_t kIrLed = 2; // ESP8266 GPIO pin to use. Recommended: 4 (D2)
    
    
    IRsend irsend;
    bool isOn;
    int temp;
    int mode;
    int speed;
    bool swing1;
    bool swing2;
    float timer;
    int fullhours;
    bool isHalfHour;
    bool isStrong;
    bool isSleep;
    bool isFeeling;
    bool isScreen;
    bool isHealth;
    int buttonPressed;

    // void (*callback)();

    // byte 0

    const uint8_t addressArray = 195;

    // byte 1
    const uint8_t swing1Array[2] = {224, 0};
    const uint8_t tempArray[17] = {2, 18, 10, 26, 6, 22, 14, 30, 1, 17, 9, 25, 5, 21, 13, 29, 3};

    // byte 2
    const uint8_t swing2Array[2] = {7, 0};

    // byte 3
    const uint8_t byte3Array = 0;

    // byte 4
    const uint8_t fullHoursArray[25] = {0, 128, 192, 32, 160, 96, 224, 16, 144, 80, 208, 48, 176, 112, 240, 8, 136, 72, 200, 40, 168, 104, 232, 24};
    const uint8_t speedArray[4] = {6, 2, 4, 5};

    // byte 5
    const uint8_t isHalfHourArray[2] = {0, 60};
    const uint8_t isStrongArray[2] = {0, 3};

    // byte 6
    const uint8_t isSleepArray[2] = {0, 32};
    const uint8_t modeArray[5] = {0, 4, 2, 1, 3};

    // byte 7
    const uint8_t isFeelOfHealthModeArray[2] = {0, 198};

    // byte 8
    const uint8_t byte8Array = 0;

    // byte 9
    const uint8_t isHealthArray[2] = {64, 0};  //[0] is allways off
    const uint8_t isHeatingArray[2] = {4, 12};
    const uint8_t isTimerArray[2] = {0, 2};

    // byte 10
    const uint8_t byte10Array = 0;

    // byte 11
    const uint8_t buttonArray[13] = {160,96, 0, 128, 176, 32, 64, 192, 16, 120, 208, 168, 224};

    //bytes array
    uint8_t rawBytes[13];

    uint8_t calcCheckSum();
    uint8_t reversedBitsNum(uint8_t n);

    void calcRawBytes();

public:
    // array
    uint16_t rawData[211];

    // modes
    const int8_t MODE_AUTO = 0;
    const int8_t MODE_COOL = 1;
    const int8_t MODE_DRY = 2;
    const int8_t MODE_HEAT = 3;
    const int8_t MODE_FAN = 4;

    // speed
    const int8_t SPEED_LOW = 0;
    const int8_t SPEED_MED = 1;
    const int8_t SPEED_HIGH = 2;
    const int8_t SPEED_AUTO = 3;

    const int8_t onOffButton = 0;
    const int8_t modeButton = 1;
    const int8_t tempPlusButton = 2;
    const int8_t tempMinusButton = 3;
    const int8_t timerButton = 4;
    const int8_t speedButton = 5;
    const int8_t swing1Button = 6;
    const int8_t swing2Button = 7;
    const int8_t strongButton = 8;
    const int8_t feelButton = 9;
    const int8_t sleepButton = 10;
    const int8_t screenButton = 11;
    const int8_t healthButton = 12;
    // AcRemote(void (_callback)(),bool _isOn, int _temp, int _mode, int _speed, bool _swing1, bool _swing2, float _timer, bool _isStrong, bool _isSleep, bool _isFeeling, bool _isScreen, bool _isHealth);
    AcRemote(
        bool _isOn, int8_t _temp, int8_t _mode, int8_t _speed, bool _swing1, bool _swing2, float _timer, bool _isStrong, bool _isSleep, bool _isFeeling, bool _isScreen, bool _isHealth);
    // AcRemote(void (*callback)());
    AcRemote();
    AcRemote& setIsOn(bool _isOn);
    // bool getIsOn();
    AcRemote& setTemp(int _temp);
    int getTemp();
    AcRemote& setMode(int _mode);
    // int8_t getMode();
    AcRemote& setSpeed(int _speed);
    // int8_t getSpeed();
    AcRemote& setSwing1(bool _swing1);
    // bool getSwing1();
    AcRemote& setSwing2(bool _swing2);
    // bool getSwing2();
    AcRemote& setTimer(int _timer);
    // float getTimer();
    AcRemote& setIsStrong(bool _isStrong);
    // bool getIsStrong();
    AcRemote& setIsSleep(bool _isSleep);
    // bool getIsSleep();
    AcRemote& setIsFeeling(bool _isFeeling);
    // bool getIsFeeling();
    AcRemote& setIsHealth(bool _isHealth);
    // bool getIsHealth();
    AcRemote& setIsScreen();
    // bool getIsScreen();
    AcRemote& calcRawData();
    AcRemote& execute();
    AcRemote& begin();
};
#endif