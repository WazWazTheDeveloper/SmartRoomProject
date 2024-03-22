#ifndef SETTINGS_HPP
#define SETTINGS_HPP
#include "LedStrip1.h"
#include "pinSettings.cpp"
#include "dataObject.h"

// Devic
char *deviceName = ("test");   // wifi ssid
char *deviceTargetID = "0000"; // has to be uniqe

// WIFI
char *wifi_ssid = ("home");           // wifi ssid
char *wifi_password = ("0525611397"); // wifi password

// MQTT broker
const char brokerIp[] = ("10.0.0.12"); // mqtt broker ip
int brokerPort = 1883;                 // mqtt broker port
char *connectionCheckRequestTopic = ("checkConnectionRequest");
char *connectionCheckResponseTopic = ("checkConnectionResponse");
char *initDeviceTopic = ("initDevice");
char *getDataTopic = ("getData");

// delays
unsigned long requestDelay = 5000; // init device delay between requests

const int deviceType[] = {0, 1, 1, 2, 1, 1, 1}; // device types array

// Dont touch this
const int deviceTypeCount = sizeof(deviceType) / sizeof(deviceType[0]);
DataObject *deviecDataArr[deviceTypeCount];

void deviceSetup()
{
    // LED STRIP 1
    LedStrip1::begin();

    // LED STRIP 1
    // LedStrip2::begin();
}

void deviceLoop()
{
    // LED STRIP 1
    LedStrip1::ledLoop();

    // LED STRIP 1
    // LedStrip2::ledLoop();
}

void led1OnSet(int dataIndex)
{
    bool isOn = false;
    deviecDataArr[dataIndex]->getData(&isOn);
    LedStrip1::setIsOn(isOn);
}

void led1Brightness(int dataIndex)
{
    int intBrightness = 0;
    deviecDataArr[dataIndex]->getData(&intBrightness);
    uint8_t brightness = (uint8_t)intBrightness;

    if (brightness > 255)
    {
        brightness = 255;
    }
    else if (brightness < 0)
    {
        brightness = 0;
    }

    LedStrip1::setBrightness(brightness);
}

void led1Mode(int dataIndex)
{
    int mode = 0;
    deviecDataArr[dataIndex]->getData(&mode);

    if (mode < 0)
    {
        mode = 0;
    }

    LedStrip1::setMode(mode);
}

void led1speed(int dataIndex)
{
    int speed = 0;
    deviecDataArr[dataIndex]->getData(&speed);

    if (speed < 0)
    {
        speed = 0;
    }

    LedStrip1::setSpeed(speed);
}

void led1red(int dataIndex)
{
    int newValue = 0;
    deviecDataArr[dataIndex]->getData(&newValue);

    if (newValue > 255)
    {
        newValue = 255;
    }
    else if (newValue < 0)
    {
        newValue = 0;
    }

    LedStrip1::setRed(newValue);
}

void led1green(int dataIndex)
{
    int newValue = 0;
    deviecDataArr[dataIndex]->getData(&newValue);
    if (newValue > 255)
    {
        newValue = 255;
    }
    else if (newValue < 0)
    {
        newValue = 0;
    }

    LedStrip1::setGreen(newValue);
}

void led1blue(int dataIndex)
{
    int newValue = 0;
    deviecDataArr[dataIndex]->getData(&newValue);
    if (newValue > 255)
    {
        newValue = 255;
    }
    else if (newValue < 0)
    {
        newValue = 0;
    }

    LedStrip1::setBlue(newValue);
}

void (*updateHardwareArr[])(int dataIndex) = {led1OnSet, led1Brightness, led1speed, led1Mode, led1red, led1green, led1blue}; // array of function to onset

#endif SETTINGS_HPP