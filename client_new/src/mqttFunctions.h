#ifndef MQTTFUNCTIONS_HPP
#define MQTTFUNCTIONS_HPP
#include "Settings.h"
#include "wifiFunctions.h"
#include <ArduinoMqttClient.h>
#include "EEPROMFunctions.h"
#include <ArduinoJson.h>

boolean setupMqtt();
void onMqttMessage(int messageSize);
void sendIsConnected();
void updateServer(int dataIndex);
void logToMqtt();
void subscribeTopics();
void unsubscribeTopics();
void sendInitDevice();
void receiveInitDevice(int messageSize);
void requestGetDevice();
void receiveGetDevice();

MqttClient mqttClient(wifiClient);

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

    // TODO: add custom device configuration to init
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

void requestGetDevice()
{
    mqttClient.subscribe(initDeviceTopic);

    JsonDocument doc;
    doc["operation"] = "initDevice";
    doc["origin"] = deviceTargetID;
    doc["deviceID"] = uuid;

    char data[384];

    doc.shrinkToFit();

    serializeJson(doc, data);

    mqttClient.beginMessage(initDeviceTopic); // topic
    mqttClient.print(data);
    mqttClient.endMessage();

    Serial.println("device init request send");

    doc.clear();
}
void receiveGetDevice()
{
}

#endif MQTTFUNCTIONS_HPP
