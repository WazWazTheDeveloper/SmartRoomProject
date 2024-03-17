#include "globalVariables.h"
#include "Settings.h"
#include "wifiFunctions.h"
#include "mqttFunctions.h"
#include "EEPROMFunctions.h"

#include <Arduino.h>
#include "dataObject.h"
#include "./dataTypes/switchData.h"
#include "./dataTypes/numberData.h"
#include "./dataTypes/multiStateButtonData.h"

// setup
bool setupDeviceObjects();

// uuid stuff

void IRAM_ATTR resetUUIDInterrupt()
{
    isResetUUID = true;
}

void setup()
{
    EEPROM.begin(512);
    Serial.begin(115200);
    attachInterrupt(digitalPinToInterrupt(RESET_DEVICE_PIN), resetUUIDInterrupt, RISING);

    setupWifi();
    setupMqtt();
    deviceSetup();

    // check if devices can be created and if not stall the device
    if (!setupDeviceObjects())
    {
        Serial.print("Can't create devices, check cofiguration");
        while (true)
            ;
    }

    // check if config is ok
}

void loop()
{
    // check if uuid need to be reset
    if (isResetUUID)
    {
        if (millis() - lastRequestedUUIDMillis > 1000)
        {
            clearUUID();
            hasData = false;
        }
        isResetUUID = false;
        return;
    }

    if (!mqttClient.connected())
    {
        // TODO: add delay between trys
        setupMqtt();
        return;
    }

    mqttClient.poll(); // keep connection alive

    // check if uuid exist
    if (strlen(uuid) == 0)
    {
        if (millis() - lastRequestedUUIDMillis > requestDelay)
        {
            lastRequestedUUIDMillis = millis();
            if (!getUUID())
            {
                sendInitDevice();
            }
        }
        return;
    }

    // check if device have data
    if (!hasData)
    {

        if (millis() - lastRequestedDataMillis > requestDelay)
        {
            lastRequestedDataMillis = millis();
            requestGetDevice();
        }
        hasData = true;
        return;
    }
}

// device object stuff
bool setupDeviceObjects()
{
    for (size_t i = 0; i < deviceTypeCount; i++)
    {

        switch (deviceType[i])
        {
        case 0:
            deviecDataArr[i] = new SwitchData(i);
            break;
        case 1:
            deviecDataArr[i] = new NumberData(i);
            break;
        case 2:
            deviecDataArr[i] = new MultiStateButtonData(i);
            break;
        default:
            return false;
            break;
        }
        deviecDataArr[i]->setUpdateServer(updateServer);
        deviecDataArr[i]->setupdateHardware(updateServer);
    }

    return true;
}
