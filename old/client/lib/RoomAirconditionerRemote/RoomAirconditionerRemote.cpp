#include "RoomAirconditionerRemote.h"
#include "Arduino.h"

IRsend roomAirconditionerIRLed(IR_LED_PIN);
uint8_t const RoomAirconditionerRemote::swing1Array[2] = {224, 0};
uint8_t const RoomAirconditionerRemote::tempArray[17] = {2, 18, 10, 26, 6, 22, 14, 30, 1, 17, 9, 25, 5, 21, 13, 29, 3};
uint8_t const RoomAirconditionerRemote::swing2Array[2] = {7, 0};
uint8_t const RoomAirconditionerRemote::fullHoursArray[25] = {0, 128, 192, 32, 160, 96, 224, 16, 144, 80, 208, 48, 176, 112, 240, 8, 136, 72, 200, 40, 168, 104, 232, 24};
uint8_t const RoomAirconditionerRemote::speedArray[4] = {6, 2, 4, 5};
uint8_t const RoomAirconditionerRemote::isHalfHourArray[2] = {0, 60};
uint8_t const RoomAirconditionerRemote::isStrongArray[2] = {0, 2};
uint8_t const RoomAirconditionerRemote::isSleepArray[2] = {0, 32};
uint8_t const RoomAirconditionerRemote::modeArray[5] = {0, 4, 2, 1, 3};
uint8_t const RoomAirconditionerRemote::isFeelOfHealthModeArray[] = {0, 198};
uint8_t const RoomAirconditionerRemote::isHealthArray[2] = {64, 0};
uint8_t const RoomAirconditionerRemote::isHeatingArray[2] = {4, 12};
uint8_t const RoomAirconditionerRemote::isTimerArray[2] = {0, 2};
uint8_t const RoomAirconditionerRemote::buttonArray[13] = {160, 96, 0, 128, 176, 32, 64, 192, 16, 120, 208, 168, 224};


void RoomAirconditionerRemote::begin()
{
    setIsOn(false);
    setTemp(20);
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
    buttonPressed = RoomAirconditionerRemote::buttonArray[onOffButton];

    roomAirconditionerIRLed.begin();
    // return *this;
}

void RoomAirconditionerRemote::execute()
{
    calcRawData();
    roomAirconditionerIRLed.sendRaw(rawData, sizeof(rawData) / sizeof(rawData[0]), 38); // Note the approach used to automatically calculate the size of the array.
    delay(50);
    // return *this;
}

// RoomAirconditionerRemote::RoomAirconditionerRemote(bool _isOn, int8_t _temp, int8_t _mode, int8_t _speed, bool _swing1, bool _swing2, float _timer, bool _isStrong, bool _isSleep, bool _isFeeling, bool _isScreen, bool _isHealth)
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
// }

// RoomAirconditionerRemote::RoomAirconditionerRemote()
// {
//     setIsOn(false);
//     setTemp(20);
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

//     // callback = defaultCallback;
// }

void RoomAirconditionerRemote::setIsOn(bool _isOn)
{
    isOn = _isOn;
    buttonPressed = buttonArray[onOffButton];

    // return *this;
}
bool RoomAirconditionerRemote::getIsOn()
{
    return isOn;
}

void RoomAirconditionerRemote::setTemp(int _temp)
{
    if (_temp < 16 || _temp > 32)
    {
        return;
    }
    if (_temp > temp)
    {
        buttonPressed = buttonArray[tempPlusButton];
    }
    if (_temp < temp)
    {
        buttonPressed = buttonArray[tempMinusButton];
    }
    temp = _temp;

    // return *this;
}
int RoomAirconditionerRemote::getTemp()
{
    return temp;
}

void RoomAirconditionerRemote::setMode(int _mode)
{
    if (_mode >= 0 && _mode <= 4)
    {
        mode = _mode;
        buttonPressed = buttonArray[modeButton];
    }
    // return *this;
}
int8_t RoomAirconditionerRemote::getMode()
{
    return mode;
}

void RoomAirconditionerRemote::setSpeed(int _speed)
{
    if (_speed >= 0 && _speed <= 3)
    {
        speed = _speed;
        buttonPressed = buttonArray[speedButton];
    }
    // return *this;
}
int8_t RoomAirconditionerRemote::getSpeed()
{
    return speed;
}

void RoomAirconditionerRemote::setSwing1(bool _swing1)
{
    swing1 = _swing1;
    buttonPressed = buttonArray[swing1Button];
    // return *this;
}
bool RoomAirconditionerRemote::getSwing1()
{
    return swing1;
}

void RoomAirconditionerRemote::setSwing2(bool _swing2)
{
    swing2 = _swing2;
    buttonPressed = buttonArray[swing2Button];
    // return *this;
}
bool RoomAirconditionerRemote::getSwing2()
{
    return swing2;
}

void RoomAirconditionerRemote::setTimer(int _timer)
{
    timer = _timer;
    fullhours = static_cast<int8_t>(timer);
    if (fullhours <= 9 && fullhours >= 0)
    {
        isHalfHour = fmod(0, 1) == 0 ? false : true;
    }
    else
    {
        isHalfHour = false;
    }
    buttonPressed = buttonArray[timerButton];
    // return *this;
}
float RoomAirconditionerRemote::getTimer()
{
    return timer;
}

void RoomAirconditionerRemote::setIsStrong(bool _isStrong)
{
    isStrong = _isStrong;
    buttonPressed = buttonArray[strongButton];
    // return *this;
}
bool RoomAirconditionerRemote::getIsStrong()
{
    return isStrong;
}

void RoomAirconditionerRemote::setIsSleep(bool _isSleep)
{
    isSleep = _isSleep;
    buttonPressed = buttonArray[sleepButton];
    // return *this;
}
bool RoomAirconditionerRemote::getIsSleep()
{
    return isSleep;
}

void RoomAirconditionerRemote::setIsFeeling(bool _isFeeling)
{
    isFeeling = _isFeeling;
    buttonPressed = buttonArray[feelButton];
    // return *this;
}
bool RoomAirconditionerRemote::getIsFeeling()
{
    return isFeeling;
}

void RoomAirconditionerRemote::setIsHealth(bool _isHealth)
{
    isHealth = _isHealth;
    buttonPressed = buttonArray[healthButton];
    // return *this;
}
bool RoomAirconditionerRemote::getIsHealth()
{
    return isHealth;
}

void RoomAirconditionerRemote::setIsScreen()
{
    isScreen = !isScreen;
    buttonPressed = buttonArray[screenButton];
    // return *this;
}
bool RoomAirconditionerRemote::getIsScreen()
{
    return isScreen;
}

void RoomAirconditionerRemote::calcRawBytes()
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
    if (isStrong)
    {
        tempByte4 += speedArray[SPEED_HIGH];
    }
    else
    {
        tempByte4 += speedArray[speed];
    }

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

uint8_t RoomAirconditionerRemote::calcCheckSum()
{
    int8_t tempLastBit = 0;
    for (size_t i = 0; i < 12; i++)
    {
        tempLastBit += reversedBitsNum(rawBytes[i]);
    }
    tempLastBit = tempLastBit % 256;
    return reversedBitsNum(tempLastBit);
}

uint8_t RoomAirconditionerRemote::reversedBitsNum(uint8_t n)
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

void RoomAirconditionerRemote::calcRawData()
{
    calcRawBytes();
    rawData[0] = 8930;
    rawData[1] = 4570;
    rawData[210] = 480;
    // for each byte is rawBytes
    for (int i = 0; i < 13; i++)
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
                rawData[placeOnRawData + 1] = 1770;
            }
        }
    }
    // return *this;
}
