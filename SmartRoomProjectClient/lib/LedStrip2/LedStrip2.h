#include "../../src/pinSettings.cpp"
#include <Arduino.h>

#ifndef LedStrip2_h
#define LedStrip2_h
#include "LedStrip2.h"

#ifndef LED_STRIP_2_NUMBER_OF_LEDS
#define LED_STRIP_2_NUMBER_OF_LEDS 10
#endif

#ifndef LED_STRIP_2_PIN
#define LED_STRIP_2_PIN 12
#endif

class LedStrip2
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
    static void setRed(int newVal);
    static void setGreen(int newVal);
    static void setBlue(int newVal);

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
