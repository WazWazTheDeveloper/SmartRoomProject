#ifndef LivingRoomAcRemote_h
#define LivingRoomAcRemote_h
#include "Arduino.h"
#include <IRremoteESP8266.h>
#include <IRsend.h>

// #include <string>

class LivingRoomAcRemote
{
private:
    const uint16_t kIrLed = 2; // ESP8266 GPIO pin to use. Recommended: 4 (D2)
    
    
    IRsend irsend;
    bool isOn;
    int temp;
    int mode;
    int speed;
    bool swing1;
    float timer1;
    int fullhours1;
    bool isHalfHour1;
    float timer2;
    int fullhours2;
    bool isHalfHour2;
    bool isStrong;
    bool isSleep;
    // bool isFeeling;
    bool isScreen;
    // bool isHealth;

    // byte 0

    const uint8_t stateAddress = 178;
    const uint8_t toggleAddress = 181;

    // byte 1

    const uint8_t stateAddress_Inverse = 77;
    const uint8_t toggleAddress_Inverse = 74;

    // byte 2
    const uint8_t speedArray_Inverse[4] = {144, 80, 48, 176};
    const uint8_t byte2on_2ndHalf_Inverse = 15;
    const uint8_t byte2off_FullByte_Inverse = 123;
    const uint8_t byte2ToggleSwitch_FullByte_Inverse = 15;
    const uint8_t byte2DryAutoMode_Inverse = 16;


    // byte 3
    const uint8_t speedArray[4] = {96, 160, 192, 64};
    const uint8_t byte3on_2ndHalf = 0;
    const uint8_t byte3off_FullByte = 132;
    const uint8_t byte3ToggleSwing_FullByte = 240;
    const uint8_t byte3DryAutoMode = 224;

    // byte 4
    const uint8_t tempArray[14] = {0, 16, 48, 32, 96, 112, 80, 64, 192, 208, 144, 128, 160, 176}; // 17 - 30
    const uint8_t byte4OffFanSwingHalf1 = 224;
    const uint8_t byte4OffSwingHalf2 = 0;
    
    const uint8_t modeArray[5] = {8, 0, 4, 12, 4};


    // byte 5
    const uint8_t tempArray_Inverse[14] = {240, 224, 192, 208, 144, 128, 160, 176, 48, 32, 96, 112, 80, 64}; // 17 - 30
    const uint8_t byte4OffFanSwingHalf1_Inverse = 31;
    const uint8_t byte4OffSwingHalf2_Inverse = 15;

    const uint8_t modeArray_Inverse[5] = {7, 15, 11, 3, 11};

    //bytes array
    uint8_t rawBytes[6];
    
    // uint8_t calcCheckSum();
    // uint8_t reversedBitsNum(uint8_t n);

    void calcRawBytesState();

public:
    // array
    uint16_t rawData[199];

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
    LivingRoomAcRemote(
        bool _isOn, int8_t _temp, int8_t _mode, int8_t _speed, bool _swing1, float _timer1, float _timer2, bool _isStrong, bool _isSleep, bool _isScreen);
    LivingRoomAcRemote();
    LivingRoomAcRemote& setIsOn(bool _isOn);
    LivingRoomAcRemote& setTemp(int _temp);
    int getTemp();
    LivingRoomAcRemote& setMode(int _mode);
    LivingRoomAcRemote& setSpeed(int _speed);
    int8_t getSpeed();
    LivingRoomAcRemote& setSwing1(bool _swing1);
    // LivingRoomAcRemote& setSwing2(bool _swing2);
    LivingRoomAcRemote& setTimer1(int _timer);
    LivingRoomAcRemote& setTimer2(int _timer);
    LivingRoomAcRemote& setIsStrong(bool _isStrong);
    LivingRoomAcRemote& setIsSleep(bool _isSleep);
    // LivingRoomAcRemote& setIsFeeling(bool _isFeeling);
    // LivingRoomAcRemote& setIsHealth(bool _isHealth);
    LivingRoomAcRemote& setIsScreen();
    LivingRoomAcRemote& calcRawData();
    LivingRoomAcRemote& execute();
    LivingRoomAcRemote& begin();
};
#endif