#include "../../src/pinSettings.cpp"
#include <Arduino.h>

#ifndef LedStrip1_h
#define LedStrip1_h
#include "LedStrip1.h"

#ifndef LED_STRIP_1_NUMBER_OF_LEDS
#define LED_STRIP_1_NUMBER_OF_LEDS 10
#endif

#ifndef LED_STRIP_1_PIN
#define LED_STRIP_1_PIN 5
#endif

class LedStrip1
{
public:
    static const int MODE_SOLID_COLOR = 0;
    static const int MODE_RAINBOW_CYCLE = 1;
    static const int MODE_RAINBOW_WAVE = 2;
    static const int MODE_COLOR_FADE = 3;

    static void begin();
    static void ledLoop();
    static void setMode(int mode);
    static void setBrightness(uint8_t brightness);
    static void setIsOn(bool isOn);
    static void setSpeed(int newSpeed);
    static void setRed(int newSpeed);
    static void setGreen(int newSpeed);
    static void setBlue(int newSpeed);

private:
    static void rainbowCycle();
    static void rainbowWave();
    static void solidColor();
    static void colorFade();
    static int lightingMode;
    static int solidColor_R;
    static int solidColor_G;
    static int solidColor_B;
    static int speed;
    static bool isOn;
    static bool isUpFadeEffect;
    static bool isInited;
};
#endif
