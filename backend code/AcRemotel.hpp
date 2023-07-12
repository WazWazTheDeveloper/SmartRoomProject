#ifndef AcRemote_H
#define AcRemote_H

namespace AcRemotel
{
    // byte 0
    const String addressstring = "11000011";

    // byte 1
    const String swing1string[2] = {"111", "000"};
    const String tempStirng[17] = {"00010", "10010", "01010", "11010", "00110", "10110", "01110", "11110", "00001", "10001", "01001", "11001", "00101", "10101", "01101", "11101", "00011"};

    // byte 2
    const String swing2string[2] = {"00000111", "00000000"};

    // byte 3
    const String byte3string = "00000000";

    // byte 4
    const String fullHoursstring[25] = {"00000", "10000", "11000", "00100", "10100", "01100", "11100", "00010", "10010", "01010", "11010", "00110", "10110", "01110", "11110", "00001", "10001", "01001", "11001", "00101", "10101", "01101", "11101", "00011"};
    const String speedstring[4] = {"110", "010", "100", "101"};

    // byte 5
    const String isHalfHourstring[2] = {"00000", "01111"};
    const String isStrongstring[2] = {"00", "11"};

    // byte 6
    const String isSleepstring[2] = {"00000", "00100"};
    const String modeString[5] = {"000", "100", "010", "001", "011"};

    // byte 7
    const String isFeelOfHealthModestring[2] = {"00000000", "11000110"};

    // byte 8
    const String byte8string = "00000000";

    // byte 9
    const String isHealthstring[2] = {"0100", "0000"};
    const String isHeatingstring[2] = {"01", "11"};
    const String isHealthstring[2] = {"00", "10"};

    // byte 10
    const String byte10string = "00000000";

    // byte 11
    const String buttonString[13] = {"10100000", "01100000", "00000000", "10000000", "10110000", "00100000", "01000000", "11000000", "00010000", "01111000", "11010000", "10101000", "11100000"};

    // modes
    const int MODE_AUTO = 0;
    const int MODE_COOL = 1;
    const int MODE_DRY = 2;
    const int MODE_HEAT = 3;
    const int MODE_FAN = 4;

    // speed
    const int SPEED_LOW = 0;
    const int SPEED_MED = 1;
    const int SPEED_HIGH = 2;
    const int SPEED_AUTO = 3;

    const int onOffButton = 0;
    const int modeButton = 1;
    const int tempPlusButton = 2;
    const int tempMinusButton = 3;
    const int timerButton = 4;
    const int speedButton = 5;
    const int swing1Button = 6;
    const int swing2Button = 7;
    const int strongButton = 8;
    const int feelButton = 9;
    const int sleepButton = 10;
    const int screenButton = 11;
    const int cleanButton = 12;
}
#endif