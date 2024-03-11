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
    doc["operation"] = "getDevice";
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

void receiveGetDevice(int messageSize)
{
    byte input[1024] = {0};
    mqttClient.readBytes(input, messageSize);
    JsonDocument doc;

    DeserializationError error = deserializeJson(doc, input);

    if (error)
    {
        Serial.print("deserializeJson() failed: ");
        Serial.println(error.c_str());
        return;
    }

    const char *origin = doc["origin"];           // "server"
    bool isSuccessful = doc["isSuccessful"];      // true
    const char *deviceID = doc["deviceID"];       // "08382d24-e09e-48f9-b2b4-bec3c3b84f4e"
    const char *operation = doc["operation"];     // "getDevice"
    const char *mqttTopicID = doc["mqttTopicID"]; // "44bd9cf5-59d1-44f5-bc86-cf849fd2ceec"

    if(strcmp(deviceID,uuid) != 0 ) return;
    if(strcmp(operation,"getDevice") != 0 ) return;
    if(strcmp(origin,"server") != 0 ) return;
    if(!isSuccessful) return;

    //set mqttTopicID

    JsonArray data = doc["data"];

    for (size_t i = 0; i < deviceTypeCount; i++)
    {
        JsonObject dataItem = data[i];
        const char *data_0_mqttTopicID = dataItem["mqttTopicID"]; // "03ac584a-ef6c-442e-9125-de4224dee260"
        int data_0_dataID = dataItem["dataID"];                   // 0
        int data_0_typeID = dataItem["typeID"];                   // 0
        bool data_0_value = dataItem["value"];                    // false

        //check each item in deviecDataArr and insert data into arr;
    }

    mqttClient.unsubscribe(initDeviceTopic);
}

#endif MQTTFUNCTIONS_HPP
