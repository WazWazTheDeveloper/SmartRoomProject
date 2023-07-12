
// #define AcRemote
// #include <string>

// class AcRemote
// {
// private:
//   bool isOn;
//   int temp;
//   int mode;
//   int speed;
//   bool swing1;
//   bool swing2;
//   float timer;
//   int fullhours;
//   bool isHalfHour;
//   bool isStrong;
//   bool isSleep;
//   bool isFeeling;
//   bool isScreen;
//   bool isHealth;

//   //byte 0
//   const std::string addressstring = "11000011";

//   //byte 1
//   const std::string swing1string[2] = {"111","000"};
//   const std::string tempStirng[17] = {"00010","10010","01010","11010","00110","10110","01110","11110","00001","10001","01001","11001","00101","10101","01101","11101","00011"};

//   //byte 2
//   const std::string swing2string[2] = {"00000111","00000000"};

//   //byte 3
//   const std::string byte3string = "00000000";

//   //byte 4
//   const std::string fullHoursstring[25] = {"00000","10000","11000","00100","10100","01100","11100","00010","10010","01010","11010","00110","10110","01110","11110","00001","10001","01001","11001","00101","10101","01101","11101","00011"};
//   const std::string speedstring[4] = {"110","010","100","101"};

//   //byte 5
//   const std::string isHalfHourstring[2] = {"00000","01111"};
//   const std::string isStrongstring[2] = {"00","11"};

//   //byte 6
//   const std::string isSleepstring[2] = {"00000","00100"};
//   const std::string modeString[5] = {"000","100","010","001","011"};

//   //byte 7
//   const std::string isFeelOfHealthModestring[2] = {"00000000","11000110"};

//   //byte 8
//   const std::string byte8string = "00000000";

//   //byte 9
//   const std::string isHealthstring[2] = {"0100","0000"};
//   const std::string isHeatingstring[2] = {"01","11"};
//   const std::string isHealthstring[2] = {"00","10"};

//   //byte 10
//   const std::string byte10string = "00000000";

//   //byte 11
//   const std::string buttonString[13] = {"10100000","01100000","00000000","10000000","10110000","00100000","01000000","11000000","00010000","01111000","11010000","10101000","11100000"};


// public:
//   //array
//   uint16_t rawData[211];

//   // modes
//   const int MODE_AUTO = 0;
//   const int MODE_COOL = 1;
//   const int MODE_DRY = 2;
//   const int MODE_HEAT = 3;
//   const int MODE_FAN = 4;

//   // speed
//   const int SPEED_LOW = 0;
//   const int SPEED_MED = 1;
//   const int SPEED_HIGH = 2;
//   const int SPEED_AUTO = 3;

//   const int onOffButton = 0;
//   const int modeButton = 1;
//   const int tempPlusButton = 2;
//   const int tempMinusButton = 3;
//   const int timerButton = 4;
//   const int speedButton = 5;
//   const int swing1Button = 6;
//   const int swing2Button = 7;
//   const int strongButton = 8;
//   const int feelButton = 9;
//   const int sleepButton = 10;
//   const int screenButton = 11;
//   const int cleanButton = 12;


//   AcRemote(bool _isOn, int _temp, int _mode, int _speed, bool _swing1, bool _swing2, float _timer, bool _isStrong, bool _isSleep, bool _isFeeling, bool _isScreen, bool _isHealth)
//   {
//     isOn = _isOn;
//     temp = _temp;
//     mode = _mode;
//     speed = _speed;
//     swing1 = _swing1;
//     swing2 = _swing2;
//     timer = _timer;
//     fullhours = static_cast<int>(_timer);
//     isHalfHour = fmod(_timer,1)==0 ? false : true;
//     isStrong = _isStrong;
//     isSleep = _isSleep;
//     isFeeling = _isFeeling;
//     isScreen = _isScreen;
//     isHealth = _isHealth;
//   }
//   AcRemote()
//   {
//     isOn = false;
//     temp = 24;
//     mode = MODE_AUTO;
//     speed = SPEED_AUTO;
//     swing1 = false;
//     swing2 = false;
//     timer = 0;
//     isStrong = false;
//     isSleep = false;
//     isFeeling = false;
//     isScreen = false;
//     isHealth = false;
//   }

//   //
//   void setIsOn(bool _isOn)
//   {
//     isOn = _isOn;
//   }
//   bool getIsOn()
//   {
//     return isOn;
//   }

//   void setTemp(int _temp)
//   {
//     temp = _temp;
//   }
//   int getTemp()
//   {
//     return temp;
//   }

//   void setMode(int _mode)
//   {
//     mode = _mode;
//   }
//   int getMode()
//   {
//     return mode;
//   }

//   void setSpeed(int _speed)
//   {
//     speed = _speed;
//   }
//   int getSpeed()
//   {
//     return speed;
//   }

//   void setSwing1(bool _swing1)
//   {
//     swing1 = _swing1;
//   }
//   bool getSwing1()
//   {
//     return swing1;
//   }

//   void setSwing2(bool _swing2)
//   {
//     swing2 = _swing2;
//   }
//   bool getSwing1()
//   {
//     return swing2;
//   }

//   void setTimer(int _timer)
//   {
//     timer = _timer;
//   }
//   float getTimer()
//   {
//     return timer;
//   }

//   void setIsStrong(bool _isStrong)
//   {
//     isStrong = _isStrong;
//   }
//   bool getIsStrong()
//   {
//     return isStrong;
//   }

//   void setIsSleep(bool _isSleep)
//   {
//     isSleep = _isSleep;
//   }
//   bool getIsStrong()
//   {
//     return isSleep;
//   }

//   void setIsFeeling(bool _isFeeling)
//   {
//     isFeeling = _isFeeling;
//   }
//   bool getIsFeeling()
//   {
//     return isFeeling;
//   }

//   void setIsHealth(bool _isHealth)
//   {
//     isHealth = _isHealth;
//   }
//   bool getIsHealth()
//   {
//     return isHealth;
//   }

//   void setIsScreen(bool _isScreen)
//   {
//     isScreen = _isScreen;
//   }
//   bool getIsScreen()
//   {
//     return isScreen;
//   }

//   void calcRawData() {
//     rawData[0] = 8930;
//     rawData[1] = 4570;
//     rawData[210] = 480;

//     std::string rawBytes[12];

//     //byte 0
//     rawBytes[0] = addressstring;

//     //byte 1
//     std::string tempSwing1;
//     std::string tempTemp;

//     if(swing1) {
//       tempSwing1 = swing1string[1];
//     }
//     else {
//       tempSwing1 = swing1string[0];
//     }
//     tempTemp = tempStirng[temp - 16];

//     rawBytes[1] = tempTemp + tempSwing1;

//     //byte 2
//     if(swing1) {
//       rawBytes[2] = swing2string[1];
//     }
//     else {
//       rawBytes[2] = swing2string[0];
//     }

//     //byte 3
//     rawBytes[3] = byte3string;
//   }
// };


// #endif