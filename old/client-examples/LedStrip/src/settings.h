#include "dataObject.h"
#include "LedStrip1.h"
#include "LedStrip2.h"

char *wifi_ssid = ("home");            // wifi ssid
char *wifi_password = ("0525611397");  // wifi password
char *deviceName = ("Test device");   // device name
const char broker[] = ("10.0.0.12");   // mqtt broker ip
const char serverip[] = ("10.0.0.12"); // server ip
int port = 1883;                       // mqtt broker port
int server_port = 1883;                // mqtt broker port

const int deviceType[] = {1, 2, 2, 3, 2, 2, 2}; // device types array

// Dont touch this
const int deviceTypeCount = sizeof(deviceType) / sizeof(deviceType[0]);
DataObject *deviecDataArr[deviceTypeCount];

// use https://arduinojson.org/v6/assistant to create this part
void setUpExtraArrayForDeviceCreation(JsonObject root)
{
    // TODO: move this somehow somewhere else
    // TODO: maybe add default values
    JsonObject led_brightness = root[F("extraConfigurations")].createNestedObject();
    led_brightness[F("dataAt")] = 1;

    JsonObject data = led_brightness.createNestedObject(F("data"));
    data[F("minVal")] = 0;
    data[F("maxVal")] = 255;
    data[F("jumpVal")] = 1;

    JsonObject led_speed = root[F("extraConfigurations")].createNestedObject();
    led_speed[F("dataAt")] = 2;

    JsonObject led_speed_data = led_speed.createNestedObject(F("data"));
    led_speed_data[F("minVal")] = 0;
    led_speed_data[F("maxVal")] = 10;
    led_speed_data[F("jumpVal")] = 0.1;

    JsonObject mode = root[F("extraConfigurations")].createNestedObject();
    mode[F("dataAt")] = 3;

    JsonObject data_addState = mode[F("data")].createNestedObject(F("addState"));
    data_addState[F("stateNumber")] = 0;
    data_addState[F("isIcon")] = false;
    data_addState[F("icon")] = "";
    data_addState[F("string")] = "solid color";

    JsonObject mode2 = root[F("extraConfigurations")].createNestedObject();
    mode2[F("dataAt")] = 3;
    JsonObject data_addState2 = mode2[F("data")].createNestedObject(F("addState"));
    data_addState2[F("stateNumber")] = 1;
    data_addState2[F("isIcon")] = false;
    data_addState2[F("icon")] = "";
    data_addState2[F("string")] = "rainbow cycle";

    JsonObject mode3 = root[F("extraConfigurations")].createNestedObject();
    mode3[F("dataAt")] = 3;
    JsonObject data_addState3 = mode3[F("data")].createNestedObject(F("addState"));
    data_addState3[F("stateNumber")] = 2;
    data_addState3[F("isIcon")] = false;
    data_addState3[F("icon")] = "";
    data_addState3[F("string")] = "rainbow wave";

    JsonObject mode4 = root[F("extraConfigurations")].createNestedObject();
    mode4[F("dataAt")] = 3;
    JsonObject data_addState4 = mode4[F("data")].createNestedObject(F("addState"));
    data_addState4[F("stateNumber")] = 3;
    data_addState4[F("isIcon")] = false;
    data_addState4[F("icon")] = "";
    data_addState4[F("string")] = "color fade";

    JsonObject led_red = root[F("extraConfigurations")].createNestedObject();
    led_red[F("dataAt")] = 4;

    JsonObject led_red_data = led_red.createNestedObject(F("data"));
    led_red_data[F("minVal")] = 0;
    led_red_data[F("maxVal")] = 255;
    led_red_data[F("jumpVal")] = 1;

    JsonObject led_green = root[F("extraConfigurations")].createNestedObject();
    led_green[F("dataAt")] = 5;

    JsonObject led_green_data = led_green.createNestedObject(F("data"));
    led_green_data[F("minVal")] = 0;
    led_green_data[F("maxVal")] = 255;
    led_green_data[F("jumpVal")] = 1;

    JsonObject led_blue = root[F("extraConfigurations")].createNestedObject();
    led_blue[F("dataAt")] = 6;

    JsonObject led_blue_data = led_blue.createNestedObject(F("data"));
    led_blue_data[F("minVal")] = 0;
    led_blue_data[F("maxVal")] = 255;
    led_blue_data[F("jumpVal")] = 1;
}

// Extra setup uncommect neccecery stuff
void extra_setup()
{
    // LED STRIP 1
    LedStrip1::begin();

    // LED STRIP 1
    // LedStrip2::begin();
}

// Extra loop stuff uncommect neccecery stuff
void extra_loop()
{
    // LED STRIP 1
    LedStrip1::ledLoop();

    // LED STRIP 1
    // LedStrip2::ledLoop();
}

// put here actions to happen when dataObject is set
void led1OnSet(int dataAt, int dataType)
{
    bool isOn = ((SwitchData *)deviecDataArr[dataAt])->isOn;
    LedStrip1::setIsOn(isOn);
}

void led1Brightness(int dataAt, int dataType)
{
    uint8_t brightness = ((NumberData *)deviecDataArr[dataAt])->value;
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

void led1Mode(int dataAt, int dataType)
{
    int mode = ((NumberData *)deviecDataArr[dataAt])->value;

    if (mode < 0)
    {
        mode = 0;
    }

    LedStrip1::setMode(mode);
}

void led1speed(int dataAt, int dataType)
{
    int speed = ((NumberData *)deviecDataArr[dataAt])->value;

    if (speed < 0)
    {
        speed = 0;
    }

    LedStrip1::setSpeed(speed);
}

void led1red(int dataAt, int dataType)
{
    uint8_t newValue = ((NumberData *)deviecDataArr[dataAt])->value;
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

void led1green(int dataAt, int dataType)
{
    uint8_t newValue = ((NumberData *)deviecDataArr[dataAt])->value;
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

void led1blue(int dataAt, int dataType)
{
    uint8_t newValue = ((NumberData *)deviecDataArr[dataAt])->value;
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

void (*onSetArray[])(int dataAt, int dataType) = {led1OnSet, led1Brightness, led1speed, led1Mode, led1red, led1green, led1blue}; // array of function to onset