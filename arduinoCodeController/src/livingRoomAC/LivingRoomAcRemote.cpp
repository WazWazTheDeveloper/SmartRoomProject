#include "LivingRoomAcRemote.h"
#include "Arduino.h"

// void defaultCallback(){};

LivingRoomAcRemote &LivingRoomAcRemote::begin()
{
    irsend.begin();
    // Serial.println(F("init"));
    return *this;
}

LivingRoomAcRemote &LivingRoomAcRemote::execute()
{
    calcRawData();
    irsend.sendRaw(rawData, sizeof(rawData) / sizeof(rawData[0]), 38); // Note the approach used to automatically calculate the size of the array.
    // for (size_t i = 0; i < sizeof(rawData) / sizeof(rawData[0]); i++)
    // {
    // Serial.print(rawData[i]);
    // Serial.print(',');
    // }
    // Serial.println(F("send"));
    delay(50);

    return *this;
}

// LivingRoomAcRemote::LivingRoomAcRemote(void (*_callback)(), bool _isOn, int _temp, int _mode, int _speed, bool _swing1, bool _swing2, float _timer, bool _isStrong, bool _isSleep, bool _isFeeling, bool _isScreen, bool _isHealth)
// {
//     setIsOn(_isOn);
//     setTemp(temp);
//     setMode(_mode);
//     setSpeed(_speed);
//     setSwing1(_swing1);
//     setSwing2(_swing2);
//     setTimer(_timer);
//     setIsStrong(_isStrong);
//     setIsSleep(_isSleep);
//     setIsFeeling(_isFeeling);
//     setIsScreen();
//     setIsHealth(_isHealth);
//

//     void (*callback)() = _callback;
// }

LivingRoomAcRemote::LivingRoomAcRemote(bool _isOn, int8_t _temp, int8_t _mode, int8_t _speed, bool _swing1, float _timer1, float _timer2, bool _isStrong, bool _isSleep, bool _isScreen) : irsend(kIrLed, true)
{
    setIsOn(_isOn);
    setTemp(temp);
    setMode(_mode);
    setSpeed(_speed);
    setSwing1(_swing1);
    setTimer1(_timer1);
    setTimer2(_timer1);
    setIsStrong(_isStrong);
    setIsSleep(_isSleep);
    setIsScreen();
}

LivingRoomAcRemote::LivingRoomAcRemote() : irsend(kIrLed, true)
{
    setIsOn(false);
    setTemp(20);
    setMode(MODE_AUTO);
    setSpeed(SPEED_AUTO);
    setSwing1(false);
    setTimer1(0);
    setTimer2(0);
    setIsStrong(false);
    setIsSleep(false);
    setIsScreen();
}

LivingRoomAcRemote &LivingRoomAcRemote::setIsOn(bool _isOn)
{
    isOn = _isOn;
    return *this;
}

LivingRoomAcRemote &LivingRoomAcRemote::setTemp(int _temp)
{
    if (_temp < 16 || _temp > 30)
    {
        return *this;
    }
    temp = _temp;

    return *this;
}
int LivingRoomAcRemote::getTemp()
{
    return temp;
}

LivingRoomAcRemote &LivingRoomAcRemote::setMode(int _mode)
{
    if (_mode >= 0 && _mode <= 4)
    {
        mode = _mode;
    }
    return *this;
}

// int8_t LivingRoomAcRemote::getMode()
// {
//     return mode;
// }

LivingRoomAcRemote &LivingRoomAcRemote::setSpeed(int _speed)
{
    if (_speed >= 0 && _speed <= 3)
    {
        speed = _speed;
    }
    return *this;
}
int8_t LivingRoomAcRemote::getSpeed()
{
    return speed;
}

LivingRoomAcRemote &LivingRoomAcRemote::setSwing1(bool _swing1)
{
    swing1 = _swing1;
    return *this;
}
// bool LivingRoomAcRemote::getSwing1()
// {
//     return swing1;
// }

LivingRoomAcRemote &LivingRoomAcRemote::setTimer1(int _timer)
{
    timer1 = _timer;
    fullhours1 = static_cast<int8_t>(timer1);
    if (fullhours1 <= 9 && fullhours1 >= 0)
    {
        isHalfHour1 = fmod(0, 1) == 0 ? false : true;
    }
    else
    {
        isHalfHour1 = false;
    }
    return *this;
}
// float LivingRoomAcRemote::getTimer1()
// {
//     return timer1;
// }

LivingRoomAcRemote &LivingRoomAcRemote::setTimer2(int _timer)
{
    timer2 = _timer;
    fullhours2 = static_cast<int8_t>(timer2);
    if (fullhours2 <= 9 && fullhours2 >= 0)
    {
        isHalfHour2 = fmod(0, 1) == 0 ? false : true;
    }
    else
    {
        isHalfHour2 = false;
    }
    return *this;
}
// float LivingRoomAcRemote::getTimer2()
// {
//     return timer2;
// }

LivingRoomAcRemote &LivingRoomAcRemote::setIsStrong(bool _isStrong)
{
    isStrong = _isStrong;
    return *this;
}
// bool LivingRoomAcRemote::getIsStrong()
// {
//     return isStrong;
// }

LivingRoomAcRemote &LivingRoomAcRemote::setIsSleep(bool _isSleep)
{
    isSleep = _isSleep;
    return *this;
}
// bool LivingRoomAcRemote::getIsSleep()
// {
//     return isSleep;
// }

// TODO: add screen
LivingRoomAcRemote &LivingRoomAcRemote::setIsScreen()
{
    isScreen = !isScreen;
    return *this;
}
// bool LivingRoomAcRemote::getIsScreen()
// {
//     return isScreen;
// }

void LivingRoomAcRemote::calcRawBytesState()
{
    // this is not off

    // byte 0
    rawBytes[0] = stateAddress;

    // byte 1
    rawBytes[1] = stateAddress_Inverse;

    // byte 2
    uint8_t tempByte2 = byte2on_2ndHalf_Inverse;
    if (mode == MODE_AUTO || mode == MODE_DRY)
    {
        tempByte2 += byte2DryAutoMode_Inverse;
    }
    else
    {
        tempByte2 += speedArray_Inverse[speed];
    }

    rawBytes[2] = tempByte2;
    // byte 3
    uint8_t tempByte3 = byte3on_2ndHalf;
    if (mode == MODE_AUTO || mode == MODE_DRY)
    {
        tempByte3 += byte3DryAutoMode;
    }
    else
    {
        tempByte3 += speedArray[speed];
    }
    rawBytes[3] = tempByte3;

    // byte 4
    uint8_t tempByte4 = 0;
    if (mode == MODE_FAN)
    {
        tempByte4 += byte4OffFanSwingHalf1;
    }
    else
    {
        tempByte4 += tempArray[temp - 17];
    }
    tempByte4 += modeArray[mode];


    rawBytes[4] = tempByte4;

    // byte 5
    uint8_t tempByte5 = 0;
    if (mode == MODE_FAN)
    {
        tempByte5 += byte4OffFanSwingHalf1_Inverse;
    }
    else
    {
        tempByte5 += tempArray_Inverse[temp - 17];
    }
    tempByte5 += modeArray_Inverse[mode];

    rawBytes[5] = tempByte5;
}

LivingRoomAcRemote &LivingRoomAcRemote::calcRawData()
{
    calcRawBytesState();
    rawData[0] = 4380;
    rawData[1] = 4420;
    rawData[98] = 480;
    // for each byte is rawBytes
    for (int i = 0; i < 6; i++)
    {
        uint8_t curByte = rawBytes[i];
        String byteString = String(curByte, 2);
        int byteLength = byteString.length();
        for (size_t i = 0; i < 8 - byteLength; i++)
        {
            byteString = "0" + byteString;
        }
        // for each bit in a byte
        for (int j = 0; j < 8; j++)
        {
            int placeOnRawData = 2 + i * 16 + j * 2;
            if (byteString[j] == '0')
            {
                rawData[placeOnRawData] = 480;
                rawData[placeOnRawData + 1] = 620;
            }
            else if (byteString[j] == '1')
            {
                rawData[placeOnRawData] = 480;
                rawData[placeOnRawData + 1] = 1720;
            }
        }
    }
    return *this;
}
