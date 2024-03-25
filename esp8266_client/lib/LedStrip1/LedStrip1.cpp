#include "LedStrip1.h"
#include <FastLED.h>

CRGB leds1[LED_STRIP_1_NUMBER_OF_LEDS];
int LedStrip1::lightingMode = 0;
int LedStrip1::solidColor_R = 255;
int LedStrip1::solidColor_G = 255;
int LedStrip1::solidColor_B = 255;
int LedStrip1::speed = 8;
bool LedStrip1::isOn = true;
bool LedStrip1::isUpFadeEffect = true;
bool LedStrip1::isInited = false;

void LedStrip1::ledLoop()
{
    if (!isOn)
    {
        for (int i = 0; i < LED_STRIP_1_NUMBER_OF_LEDS; i++)
        {
            leds1[i] = CRGB(0, 0, 0);
            FastLED.show();
        }

        return;
    }

    switch (LedStrip1::lightingMode)
    {
    case (LedStrip1::MODE_SOLID_COLOR):
        LedStrip1::solidColor();
        break;
    case (LedStrip1::MODE_RAINBOW_CYCLE):
        LedStrip1::rainbowCycle();
        break;
    case (LedStrip1::MODE_RAINBOW_WAVE):
        LedStrip1::rainbowWave();
        break;
    case (LedStrip1::MODE_COLOR_FADE):
        LedStrip1::colorFade();
        break;
    }
}

void LedStrip1::solidColor()
{
    for (int i = 0; i < LED_STRIP_1_NUMBER_OF_LEDS; i++)
    {
        leds1[i] = CRGB(LedStrip1::solidColor_R, LedStrip1::solidColor_G, LedStrip1::solidColor_B);
        FastLED.show();
    }
}

void LedStrip1::begin()
{
    FastLED.addLeds<WS2812, LED_STRIP_1_PIN, GRB>(leds1, LED_STRIP_1_NUMBER_OF_LEDS);
    LedStrip1::lightingMode = 0;
}

void LedStrip1::setBrightness(uint8_t brightness)
{
    FastLED.setBrightness(brightness);
    FastLED.show();
}

unsigned long lastChangedRainbowCycle = 0;

void LedStrip1::rainbowCycle()
{
    if (millis() - lastChangedRainbowCycle < 15)
        return;

    lastChangedRainbowCycle = millis();
    int timingInterval = LedStrip1::speed;

    int tempRed = leds1[0].r;
    int tempGreen = leds1[0].g;
    int tempBlue = leds1[0].b;
    if (!LedStrip1::isInited)
    {
        tempRed = 0;
        tempGreen = 0;
        tempBlue = 0;
        LedStrip1::isInited = true;
    }

    if (tempRed == 0 && tempBlue == 0 && tempBlue == 0)
    {
        tempRed = 255;
    }

    if (tempRed == 255 && tempBlue == 0)
    {
        tempGreen += timingInterval;
        if (tempGreen >= 255)
        {
            tempGreen = 255;
        }
    }

    if (tempGreen == 255 && tempBlue == 0)
    {
        tempRed -= timingInterval;
        if (tempRed <= 0)
        {
            tempRed = 0;
        }
    }

    if (tempRed == 0 && tempGreen == 255)
    {
        tempBlue += timingInterval;
        if (tempBlue >= 255)
        {
            tempBlue = 255;
        }
    }

    if (tempRed == 0 && tempBlue == 255)
    {
        tempGreen -= timingInterval;
        if (tempGreen <= 0)
        {
            tempGreen = 0;
        }
    }

    if (tempGreen == 0 && tempBlue == 255)
    {
        tempRed += timingInterval;
        if (tempRed >= 255)
        {
            tempRed = 255;
        }
    }

    if (tempRed == 255 && tempGreen == 0)
    {
        tempBlue -= timingInterval;
        if (tempBlue <= 0)
        {
            tempBlue = 0;
        }
    }

    for (int i = 0; i < LED_STRIP_1_NUMBER_OF_LEDS; i++)
    {
        leds1[i] = CRGB(tempRed, tempGreen, tempBlue);
    }
    FastLED.show();
}

unsigned long lastChangedRainbowWave = 0;
void LedStrip1::rainbowWave()
{
    if (millis() - lastChangedRainbowWave < 5)
        return;
        
    lastChangedRainbowWave = millis();

    int initialInterval = 32;
    int timingInterval = LedStrip1::speed;

    int firstRed = leds1[0].r;
    int firstGreen = leds1[0].g;
    int firstBlue = leds1[0].b;

    if (!LedStrip1::isInited)
    {
        firstRed = 0;
        firstGreen = 0;
        firstBlue = 0;
        for (int i = 0; i < LED_STRIP_1_NUMBER_OF_LEDS; i++)
        {
            if (firstRed == 0 && firstBlue == 0 && firstBlue == 0)
            {
                firstRed = 255;
            }

            if (firstRed == 255 && firstBlue == 0)
            {
                firstGreen += initialInterval;
                if (firstGreen >= 255)
                {
                    firstGreen = 255;
                }
            }

            if (firstGreen == 255 && firstBlue == 0)
            {
                firstRed -= initialInterval;
                if (firstRed <= 0)
                {
                    firstRed = 0;
                }
            }

            if (firstRed == 0 && firstGreen == 255)
            {
                firstBlue += initialInterval;
                if (firstBlue >= 255)
                {
                    firstBlue = 255;
                }
            }

            if (firstRed == 0 && firstBlue == 255)
            {
                firstGreen -= initialInterval;
                if (firstGreen <= 0)
                {
                    firstGreen = 0;
                }
            }

            if (firstGreen == 0 && firstBlue == 255)
            {
                firstRed += initialInterval;
                if (firstRed >= 255)
                {
                    firstRed = 255;
                }
            }

            if (firstRed == 255 && firstGreen == 0)
            {
                firstBlue -= initialInterval;
                if (firstBlue <= 0)
                {
                    firstBlue = 0;
                }
            }

            leds1[i] = CRGB(firstRed, firstGreen, firstBlue);
            LedStrip1::isInited = true;
        }
    }

    for (int i = 0; i < LED_STRIP_1_NUMBER_OF_LEDS; i++)
    {
        int tempRed = leds1[i].r;
        int tempGreen = leds1[i].g;
        int tempBlue = leds1[i].b;
        if (tempRed == 0 && tempBlue == 0 && tempBlue == 0)
        {
            tempRed = 255;
        }

        if (tempRed == 255 && tempBlue == 0)
        {
            tempGreen += timingInterval;
            if (tempGreen >= 255)
            {
                tempGreen = 255;
            }
        }

        if (tempGreen == 255 && tempBlue == 0)
        {
            tempRed -= timingInterval;
            if (tempRed <= 0)
            {
                tempRed = 0;
            }
        }

        if (tempRed == 0 && tempGreen == 255)
        {
            tempBlue += timingInterval;
            if (tempBlue >= 255)
            {
                tempBlue = 255;
            }
        }

        if (tempRed == 0 && tempBlue == 255)
        {
            tempGreen -= timingInterval;
            if (tempGreen <= 0)
            {
                tempGreen = 0;
            }
        }

        if (tempGreen == 0 && tempBlue == 255)
        {
            tempRed += timingInterval;
            if (tempRed >= 255)
            {
                tempRed = 255;
            }
        }

        if (tempRed == 255 && tempGreen == 0)
        {
            tempBlue -= timingInterval;
            if (tempBlue <= 0)
            {
                tempBlue = 0;
            }
        }

        leds1[i] = CRGB(tempRed, tempGreen, tempBlue);
    }
    FastLED.show();
}

void LedStrip1::colorFade()
{
    LedStrip1::solidColor();
    uint8_t brightness = FastLED.getBrightness();
    if (brightness == 255)
    {
        LedStrip1::isUpFadeEffect = false;
    }
    else if (brightness == 0)
    {
        LedStrip1::isUpFadeEffect = true;
    }

    if (LedStrip1::isUpFadeEffect)
    {
        brightness++;
    }
    else
    {
        brightness--;
    }
    FastLED.setBrightness(brightness);
    FastLED.show();
    delay(2 * LedStrip1::speed);
}

void LedStrip1::setIsOn(bool isOn)
{
    LedStrip1::isOn = isOn;
    LedStrip1::isInited = false;
}

void LedStrip1::setMode(int mode)
{
    LedStrip1::lightingMode = mode;
    LedStrip1::isInited = false;
}

void LedStrip1::setSpeed(int newSpeed)
{
    LedStrip1::speed = newSpeed;
}

void LedStrip1::setRed(int newVal)
{
    LedStrip1::solidColor_R = newVal;
}

void LedStrip1::setGreen(int newVal)
{
    LedStrip1::solidColor_G = newVal;
}

void LedStrip1::setBlue(int newVal)
{
    LedStrip1::solidColor_B = newVal;
}
