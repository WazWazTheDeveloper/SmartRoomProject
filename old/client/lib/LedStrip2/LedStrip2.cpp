#include "LedStrip2.h"
#include <FastLED.h>

CRGB leds2[LED_STRIP_2_NUMBER_OF_LEDS];
int LedStrip2::lightingMode = 0;
int LedStrip2::solidColor_R = 255;
int LedStrip2::solidColor_G = 255;
int LedStrip2::solidColor_B = 255;
int LedStrip2::speed = 8;
bool LedStrip2::isOn = true;
bool LedStrip2::isUpFadeEffect = true;
bool LedStrip2::isInited = false;

void LedStrip2::ledLoop()
{
    if (!isOn)
    {
        for (int i = 0; i < LED_STRIP_2_NUMBER_OF_LEDS; i++)
        {
            leds2[i] = CRGB(0, 0, 0);
            FastLED.show();
        }

        return;
    }

    switch (LedStrip2::lightingMode)
    {
    case (LedStrip2::MODE_SOLID_COLOR):
        LedStrip2::solidColor();
        break;
    case (LedStrip2::MODE_RAINBOW_CYCLE):
        LedStrip2::rainbowCycle();
        break;
    case (LedStrip2::MODE_RAINBOW_WAVE):
        LedStrip2::rainbowWave();
        break;
    case (LedStrip2::MODE_COLOR_FADE):
        LedStrip2::colorFade();
        break;
    }
}

void LedStrip2::solidColor()
{
    for (int i = 0; i < LED_STRIP_2_NUMBER_OF_LEDS; i++)
    {
        leds2[i] = CRGB(LedStrip2::solidColor_R, LedStrip2::solidColor_G, LedStrip2::solidColor_B);
        FastLED.show();
    }
}

void LedStrip2::begin()
{
    FastLED.addLeds<WS2812, LED_STRIP_2_PIN, GRB>(leds2, LED_STRIP_2_NUMBER_OF_LEDS);
    LedStrip2::lightingMode = 0;
}

void LedStrip2::setBrightness(uint8_t brightness)
{
    FastLED.setBrightness(brightness);
    FastLED.show();
}

void LedStrip2::rainbowCycle()
{
    int timingInterval = 8 * LedStrip2::speed;

    int tempRed = leds2[0].r;
    int tempGreen = leds2[0].g;
    int tempBlue = leds2[0].b;
    if (!LedStrip2::isInited)
    {
        tempRed = 0;
        tempGreen = 0;
        tempBlue = 0;
        LedStrip2::isInited = true;
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
        leds2[i] = CRGB(tempRed, tempGreen, tempBlue);
    }
    FastLED.show();
}

void LedStrip2::rainbowWave()
{
    int initialInterval = 32;
    int timingInterval = 8 * LedStrip2::speed;

    int firstRed = leds2[0].r;
    int firstGreen = leds2[0].g;
    int firstBlue = leds2[0].b;

    if (!LedStrip2::isInited)
    {
        firstRed = 0;
        firstGreen = 0;
        firstBlue = 0;
        for (int i = 0; i < LED_STRIP_2_NUMBER_OF_LEDS; i++)
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

            leds2[i] = CRGB(firstRed, firstGreen, firstBlue);
            LedStrip2::isInited = true;
        }
    }

    for (int i = 0; i < LED_STRIP_2_NUMBER_OF_LEDS; i++)
    {
        int tempRed = leds2[i].r;
        int tempGreen = leds2[i].g;
        int tempBlue = leds2[i].b;
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

        leds2[i] = CRGB(tempRed, tempGreen, tempBlue);
    }
    FastLED.show();
}

void LedStrip2::colorFade()
{
    LedStrip2::solidColor();
    uint8_t brightness = FastLED.getBrightness();
    if (brightness == 255)
    {
        LedStrip2::isUpFadeEffect = false;
    }
    else if (brightness == 0)
    {
        LedStrip2::isUpFadeEffect = true;
    }

    if (LedStrip2::isUpFadeEffect)
    {
        brightness++;
    }
    else
    {
        brightness--;
    }
    FastLED.setBrightness(brightness);
    FastLED.show();
    delay(2 * LedStrip2::speed);
}

void LedStrip2::setIsOn(bool isOn)
{
    LedStrip2::isOn = isOn;
    LedStrip2::isInited = false;
}

void LedStrip2::setMode(int mode)
{
    LedStrip2::lightingMode = mode;
    LedStrip2::isInited = false;
}

void LedStrip2::setSpeed(int newSpeed)
{
    LedStrip2::speed = newSpeed;
}

void LedStrip2::setRed(int newVal)
{
    LedStrip2::solidColor_R = newVal;
}

void LedStrip2::setGreen(int newVal)
{
    LedStrip2::solidColor_G = newVal;
}

void LedStrip2::setBlue(int newVal)
{
    LedStrip2::solidColor_B = newVal;
}