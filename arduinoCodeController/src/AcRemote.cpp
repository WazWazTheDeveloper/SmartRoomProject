#define IR_SEND_PIN 8

#include "AcRemote.h"
#include "Arduino.h"
#include <IRremote.hpp>

// void defaultCallback(){};

AcRemote& AcRemote::begin(){
    IrSender.begin();
    // Serial.println(F("send"));
    // return *this;
}

AcRemote& AcRemote::execute()
{
    calcRawData();
    IrSender.sendRaw(rawData, sizeof(rawData) / sizeof(rawData[0]), NEC_KHZ); // Note the approach used to automatically calculate the size of the array.
    // Serial.println(F("send"));
    return *this;
}

// AcRemote::AcRemote(void (*_callback)(), bool _isOn, int _temp, int _mode, int _speed, bool _swing1, bool _swing2, float _timer, bool _isStrong, bool _isSleep, bool _isFeeling, bool _isScreen, bool _isHealth)
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
//     buttonPressed = buttonArray[onOffButton];

//     void (*callback)() = _callback;
// }

AcRemote::AcRemote(bool _isOn, int8_t _temp, int8_t _mode, int8_t _speed, bool _swing1, bool _swing2, float _timer, bool _isStrong, bool _isSleep, bool _isFeeling, bool _isScreen, bool _isHealth)
{
    setIsOn(_isOn);
    setTemp(temp);
    setMode(_mode);
    setSpeed(_speed);
    setSwing1(_swing1);
    setSwing2(_swing2);
    setTimer(_timer);
    setIsStrong(_isStrong);
    setIsSleep(_isSleep);
    setIsFeeling(_isFeeling);
    setIsScreen();
    setIsHealth(_isHealth);
    buttonPressed = buttonArray[onOffButton];

    // void (*callback)() = defaultCallback;
}

// AcRemote::AcRemote(void (*_callback)())
// {
//     setIsOn(false);
//     setTemp(24);
//     setMode(MODE_AUTO);
//     setSpeed(SPEED_AUTO);
//     setSwing1(false);
//     setSwing2(false);
//     setTimer(0);
//     setIsStrong(false);
//     setIsSleep(false);
//     setIsFeeling(false);
//     setIsScreen();
//     setIsHealth(false);
//     buttonPressed = buttonArray[onOffButton];

//     callback = *_callback;
// }

AcRemote::AcRemote()
{
    setIsOn(false);
    setTemp(24);
    setMode(MODE_AUTO);
    setSpeed(SPEED_AUTO);
    setSwing1(false);
    setSwing2(false);
    setTimer(0);
    setIsStrong(false);
    setIsSleep(false);
    setIsFeeling(false);
    setIsScreen();
    setIsHealth(false);
    buttonPressed = buttonArray[onOffButton];

    // callback = defaultCallback;
}

AcRemote& AcRemote::setIsOn(bool _isOn)
{
    isOn = _isOn;
    buttonPressed = buttonArray[onOffButton];

    return *this;
}
// bool AcRemote::getIsOn()
// {
//     return isOn;
// }

AcRemote& AcRemote::setTemp(int8_t _temp)
{
    if (temp < 16 || temp > 32)
    {
        return;
    }
    if (_temp > temp)
    {
        buttonPressed = buttonArray[tempPlusButton];
    }
    if (_temp > temp)
    {
        buttonPressed = buttonArray[tempMinusButton];
    }
    temp = _temp;

    return *this;
}
// int8_t AcRemote::getTemp()
// {
//     return temp;
// }

AcRemote& AcRemote::setMode(int8_t _mode)
{
    if (_mode >= 0 && _mode <= 4)
    {
        mode = _mode;
        buttonPressed = buttonArray[modeButton];
    }
    return *this;
}
// int8_t AcRemote::getMode()
// {
//     return mode;
// }

AcRemote& AcRemote::setSpeed(int8_t _speed)
{
    if (_speed >= 0 && _speed <= 3)
    {
        speed = _speed;
        buttonPressed = buttonArray[speedButton];
    }
    return *this;
}
// int8_t AcRemote::getSpeed()
// {
//     return speed;
// }

AcRemote& AcRemote::setSwing1(bool _swing1)
{
    swing1 = _swing1;
    buttonPressed = buttonArray[swing1Button];
    return *this;
}
// bool AcRemote::getSwing1()
// {
//     return swing1;
// }

AcRemote& AcRemote::setSwing2(bool _swing2)
{
    swing2 = _swing2;
    buttonPressed = buttonArray[swing2Button];
    return *this;
}
// bool AcRemote::getSwing2()
// {
//     return swing2;
// }

AcRemote& AcRemote::setTimer(int8_t _timer)
{
    timer = _timer;
    fullhours = static_cast<int8_t>(timer);
    if (fullhours <= 9 && fullhours >= 0)
    {
        isHalfHour = fmod(0, 1) == 0 ? false : true;
    }else {
        isHalfHour = false;
    }
    buttonPressed = buttonArray[timerButton];
    return *this;
}
// float AcRemote::getTimer()
// {
//     return timer;
// }

AcRemote& AcRemote::setIsStrong(bool _isStrong)
{
    isStrong = _isStrong;
    buttonPressed = buttonArray[strongButton];
    return *this;
}
// bool AcRemote::getIsStrong()
// {
//     return isStrong;
// }

AcRemote& AcRemote::setIsSleep(bool _isSleep)
{
    isSleep = _isSleep;
    buttonPressed = buttonArray[sleepButton];
    return *this;
}
// bool AcRemote::getIsSleep()
// {
//     return isSleep;
// }

AcRemote& AcRemote::setIsFeeling(bool _isFeeling)
{
    isFeeling = _isFeeling;
    buttonPressed = buttonArray[feelButton];
    return *this;
}
// bool AcRemote::getIsFeeling()
// {
//     return isFeeling;
// }

AcRemote& AcRemote::setIsHealth(bool _isHealth)
{
    isHealth = _isHealth;
    buttonPressed = buttonArray[healthButton];
    return *this;
}
// bool AcRemote::getIsHealth()
// {
//     return isHealth;
// }

AcRemote& AcRemote::setIsScreen()
{
    isScreen = !isScreen;
    buttonPressed = buttonArray[screenButton];
    return *this;
}
// bool AcRemote::getIsScreen()
// {
//     return isScreen;
// }

void AcRemote::calcRawBytes()
{
    // byte 0
    rawBytes[0] = addressArray;

    // byte 1
    uint8_t tempByte1 = 0;

    if (swing1)
    {
        tempByte1 += swing1Array[1];
    }
    else
    {
        tempByte1 += swing1Array[0];
    }
    tempByte1 += tempArray[temp - 16];

    rawBytes[1] = tempByte1;

    // byte 2
    uint8_t tempByte2 = 0;

    if (swing1)
    {
        tempByte2 += swing2Array[1];
    }
    else
    {
        tempByte2 += swing2Array[0];
    }

    rawBytes[2] = tempByte2;
    // byte 3

    rawBytes[3] = byte3Array;

    // byte 4
    uint8_t tempByte4 = 0;

    tempByte4 += fullHoursArray[fullhours];
    tempByte4 += speedArray[speed];

    rawBytes[4] = tempByte4;

    // byte 5
    uint8_t tempByte5 = 0;

    if (isHalfHour)
    {
        tempByte5 += isHalfHourArray[1];
    }
    else
    {
        tempByte5 += isHalfHourArray[0];
    }

    if (isStrong)
    {
        tempByte5 += isStrongArray[1];
    }
    else
    {
        tempByte5 += isStrongArray[0];
    }
    rawBytes[5] = tempByte5;

    // byte 6
    uint8_t tempByte6 = 0;

    if (isSleep)
    {
        tempByte6 += isSleepArray[1];
    }
    else
    {
        tempByte6 += isSleepArray[0];
    }

    tempByte6 += modeArray[mode];

    rawBytes[6] = tempByte6;

    // byte 7
    uint8_t tempByte7 = 0;

    if (isFeeling || isHealth)
    {
        tempByte7 = isFeelOfHealthModeArray[1];
    }
    else
    {
        rawBytes[7] = isFeelOfHealthModeArray[0];
    }

    rawBytes[7] = tempByte7;

    // byte 8
    rawBytes[8] = byte8Array;

    // byte 9

    if (isOn)
    {
        uint8_t tempByte9 = 0;

        if (isHealth)
        {
            tempByte9 += isHealthArray[1];
        }
        else
        {
            tempByte9 += isHealthArray[0];
        }

        if (mode == MODE_HEAT)
        {
            tempByte9 += isHeatingArray[1];
        }
        else
        {
            tempByte9 += isHeatingArray[0];
        }

        if (timer != 0)
        {
            tempByte9 += isTimerArray[1];
        }
        else
        {
            tempByte9 += isTimerArray[0];
        }

        rawBytes[9] = tempByte9;
    }
    else
    {
        // "00000000" represent a/c off
        rawBytes[9] = 0;
    }

    // byte 10
    rawBytes[10] = byte10Array;

    // byte 11
    rawBytes[11] = buttonArray[onOffButton];

    // byte 12 or else know as the check sum
    rawBytes[12] = calcCheckSum();
}

uint8_t AcRemote::calcCheckSum()
{
    int8_t tempLastBit = 0;
    for (size_t i = 0; i < 12; i++)
    {
        tempLastBit += reversedBitsNum(rawBytes[i]);
    }
    tempLastBit = tempLastBit % 256;
    return reversedBitsNum(tempLastBit);
}

uint8_t AcRemote::reversedBitsNum(uint8_t n)
{
    uint8_t dn = 0; // variable for new decimal number
    int j = 6;      // initial value of j
    // loop to find the reversede binary bit
    for (int i = 0; i < 8; ++i)
    {
        int k = (n >> i) & 1; // k will be the required bit
        if (k)
        { // if bit is set then only convert in
          // decimal
            if (j == -1)
            { // since if j = -1 then left
              // shift operator will not work
                dn = abs(dn) + pow(2, 0);
            }
            else
            {
                dn = abs(dn) + (2 << j); // here left shift operator
                                         // calculates 2 to power j
                                         // for making code efficient
            }
        }
        j--; // j is decreased in each iteration
    }
    return abs(dn);
}

AcRemote& AcRemote::calcRawData()
{
    calcRawBytes();

    rawData[0] = 8930;
    rawData[1] = 4570;
    rawData[210] = 480;

    // for each byte is rawBytes
    for (int8_t i = 0; i < 13; i++)
    {
        uint8_t curByte = rawBytes[i];

        // char tempByte[8] = {'\0'};
        // TODO: turn this into achar array to save space
        String byteString = String(curByte, 2);

        int byteLength = byteString.length();
        for (size_t i = 0; i < 8 - byteLength; i++)
        {
            byteString = "0" + byteString;
        }

        // for each bit in a byte
        for (int8_t j = 0; j < 8; j++)
        {
            int8_t placeOnRawData = 2 + i * 16 + j * 2;
            if (byteString[j] == '0')
            {
                rawData[placeOnRawData] = 480;
                rawData[placeOnRawData + 1] = 620;
            }
            else if (byteString[j] == '1')
            {
                rawData[placeOnRawData] = 480;
                rawData[placeOnRawData + 1] = 1770;
            }
        }
    }

    return *this;
}