#ifndef RoomAirconditionerRemote_h
#define RoomAirconditionerRemote_h
#include "Arduino.h"
#include <IRremoteESP8266.h>
#include <IRsend.h>

#ifndef IR_LED_PIN
#define IR_LED_PIN 5
#endif


class RoomAirconditionerRemote
{
private:
    static bool isOn;
    static int temp;
    static int mode;
    static int speed;
    static bool swing1;
    static bool swing2;
    static float timer;
    static int fullhours;
    static bool isHalfHour;
    static bool isStrong;
    static bool isSleep;
    static bool isFeeling;
    static bool isScreen;
    static bool isHealth;
    static int buttonPressed;

    // void (*callback)();

    // byte 0

    static const uint8_t addressArray = 195;

    // byte 1
    static const uint8_t swing1Array[2];
    static const uint8_t tempArray[17];

    // byte 2
    static const uint8_t swing2Array[2];

    // byte 3
    static const uint8_t byte3Array = 0;

    // byte 4
    static const uint8_t fullHoursArray[25];
    static const uint8_t speedArray[4];

    // byte 5
    static const uint8_t isHalfHourArray[2];
    static const uint8_t isStrongArray[2];

    // byte 6
    static const uint8_t isSleepArray[2];
    static const uint8_t modeArray[5];

    // byte 7
    static const uint8_t isFeelOfHealthModeArray[2];

    // byte 8
    static const uint8_t byte8Array = 0;

    // byte 9
    static const uint8_t isHealthArray[2]; //[0] is allways off
    static const uint8_t isHeatingArray[2];
    static const uint8_t isTimerArray[2];

    // byte 10
    static const uint8_t byte10Array = 0;

    // byte 11
    static const uint8_t buttonArray[13];

    // bytes array
    static uint8_t rawBytes[13];

    static uint8_t calcCheckSum();
    static uint8_t reversedBitsNum(uint8_t n);

    static void calcRawBytes();

public:
    // array
    static uint16_t rawData[211];

    // modes
    static const int8_t MODE_AUTO = 0;
    static const int8_t MODE_COOL = 1;
    static const int8_t MODE_DRY = 2;
    static const int8_t MODE_HEAT = 3;
    static const int8_t MODE_FAN = 4;

    // speed
    static const int8_t SPEED_LOW = 0;
    static const int8_t SPEED_MED = 1;
    static const int8_t SPEED_HIGH = 2;
    static const int8_t SPEED_AUTO = 3;

    static const int8_t onOffButton = 0;
    static const int8_t modeButton = 1;
    static const int8_t tempPlusButton = 2;
    static const int8_t tempMinusButton = 3;
    static const int8_t timerButton = 4;
    static const int8_t speedButton = 5;
    static const int8_t swing1Button = 6;
    static const int8_t swing2Button = 7;
    static const int8_t strongButton = 8;
    static const int8_t feelButton = 9;
    static const int8_t sleepButton = 10;
    static const int8_t screenButton = 11;
    static const int8_t healthButton = 12;
    // RoomAirconditionerRemote(
        // bool _isOn, int8_t _temp, int8_t _mode, int8_t _speed, bool _swing1, bool _swing2, float _timer, bool _isStrong, bool _isSleep, bool _isFeeling, bool _isScreen, bool _isHealth);
    // RoomAirconditionerRemote();
    static void setIsOn(bool _isOn);
    static bool getIsOn();
    static void setTemp(int _temp);
    static int getTemp();
    static void setMode(int _mode);
    static int8_t getMode();
    static void setSpeed(int _speed);
    static int8_t getSpeed();
    static void setSwing1(bool _swing1);
    static bool getSwing1();
    static void setSwing2(bool _swing2);
    static bool getSwing2();
    static void setTimer(int _timer);
    static float getTimer();
    static void setIsStrong(bool _isStrong);
    static bool getIsStrong();
    static void setIsSleep(bool _isSleep);
    static bool getIsSleep();
    static void setIsFeeling(bool _isFeeling);
    static bool getIsFeeling();
    static void setIsHealth(bool _isHealth);
    static bool getIsHealth();
    static void setIsScreen();
    static bool getIsScreen();
    static void calcRawData();
    static void execute();
    static void begin();
};
#endif