#include "Settings.h"
#include "pinSettings.cpp"
#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ArduinoJson.h>
#include <ArduinoMqttClient.h>
#include <EEPROM.h>
#include "dataObject.h"
#include "./dataTypes/switchData.h"
#include "./dataTypes/numberData.h"
#include "./dataTypes/multiStateButtonData.h"

WiFiClient wifiClient;
MqttClient mqttClient(wifiClient);

unsigned long lastRequestedUUIDMillis = 0;
bool isResetUUID = false;
unsigned long lastUUIDReset = 0;

char uuid[37] = {'\0'};

// setup
void setupWifi();
boolean setupMqtt();
bool setupDeviceObjects();

// uuid stuff
void readUUID();
void writeUUID();
void clearUUID();
boolean getUUID();

// mqtt stuff
void onMqttMessage(int messageSize);
void sendIsConnected();
void updateServer(int dataIndex);
void logToMqtt();
void subscribeTopics();
void unsubscribeTopics();
void sendInitDevice();
void receiveInitDevice(int messageSize);

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
        }
        isResetUUID = false;
    }

    if (!mqttClient.connected())
    {
        setupMqtt();
        return;
    }

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
    }
}

void setupWifi()
{
    WiFi.mode(WIFI_STA);
    WiFi.begin(wifi_ssid, wifi_password);

    Serial.print("Connecting to WiFi ..");
    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.print(".");
    }
    Serial.println();
    Serial.print("Device ip:");
    Serial.println(WiFi.localIP());

    WiFi.setAutoReconnect(true);
    // WiFi.persistent(true);
}

// mqtt stuff

boolean setupMqtt()
{
    mqttClient.setId("Arduino-TEST");
    if (!mqttClient.connect(brokerIp, brokerPort))
    {
        Serial.println(mqttClient.connectError());
        return 0;
        // setupMqtt()
        // while (1)
        //     ;
    }
    Serial.println(F("connected to mqtt server"));
    mqttClient.subscribe(connectionCheckRequestTopic);
    mqttClient.onMessage(onMqttMessage);
    subscribeTopics();
    return 1;
}

void onMqttMessage(int messageSize)
{
    if (mqttClient.messageTopic().compareTo(connectionCheckRequestTopic) == 0)
    {
        Serial.println(F("recived connection check request"));
        sendIsConnected();
        return;
    }
    else if (mqttClient.messageTopic().compareTo(initDeviceTopic) == 0)
    {
        Serial.println(F("recived init device response"));
        receiveInitDevice(messageSize);
        return;
    }
}

void subscribeTopics()
{
}

void unsubscribeTopics()
{
}

void sendIsConnected()
{
}

void updateServer(int dataId)
{
}

void sendInitDevice()
{
    // check if enough time passed
    mqttClient.subscribe(initDeviceTopic);

    JsonDocument doc;
    doc["operation"] = "initDevice";
    doc["origin"] = deviceTargetID;
    JsonArray dataTypeArray = doc["dataTypeArray"].to<JsonArray>();

    for (size_t i = 0; i < deviceTypeCount; i++)
    {
        JsonObject dataTypeArrayObj = dataTypeArray.add<JsonObject>();
        dataTypeArrayObj["dataID"] = deviecDataArr[i]->getDataId();
        dataTypeArrayObj["typeID"] = deviecDataArr[i]->getTypeId();
    }

    char data[384];
    
    doc.shrinkToFit();

    serializeJson(doc, data);

    mqttClient.beginMessage(initDeviceTopic); // topic
    mqttClient.print(data);
    mqttClient.endMessage();

    Serial.println("device init request send");

    doc.clear();
}

void receiveInitDevice(int messageSize)
{
    byte data[512] = {0};
    mqttClient.readBytes(data, messageSize);

    JsonDocument doc;
    DeserializationError error = deserializeJson(doc, data);

    if (error)
    {
        Serial.print(F("deserializeJson() failed: "));
        Serial.println(error.f_str());
        return;
    }

    bool isSuccessful = doc["isSuccessful"];  // true
    const char *operation = doc["operation"]; // "initDevice"
    const char *origin = doc["origin"];       // "server"
    const char *target = doc["target"];       // "string"
    const char *id = doc["_id"];              // "d5f6b44d-6278-43b5-bc91-db2f4b70efdc"

    if (!isSuccessful)
        return;
    if (strcmp(operation, "initDevice") != 0)
        return;
    if (strcmp(origin, "server") != 0)
        return;
    if (strcmp(target, deviceTargetID) != 0)
        return;

    strncpy(uuid, id, 36);
    uuid[36] = '\0';
    writeUUID();

    mqttClient.unsubscribe(initDeviceTopic);
}

// eerpom
void readUUID()
{
    EEPROM.get(0, uuid);
    Serial.println("read UUID form eeprom");
    Serial.print("uuid: ");
    Serial.println(uuid);
    uuid[36] = '\0';
}

void writeUUID()
{
    EEPROM.put(0, uuid);
    EEPROM.end();
    Serial.println("wrote UUID to eeprom");
    Serial.print("uuid: ");
    Serial.println(uuid);
}

void clearUUID()
{
    for (int i = 0; i < 37; i++)
    {
        EEPROM.write(i, 0);
    }
    EEPROM.end();
    const char *empty = "";
    strcpy(uuid, empty);
    Serial.println("cleared eeprom");
}

boolean getUUID()
{
    readUUID();
    if (strlen(uuid) != 0)
    {
        return 1;
    }
    return 0;
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
        // deviecDataArr[i] -> setupdateHardware(updateServer); TODO: add this
    }

    return true;
}
