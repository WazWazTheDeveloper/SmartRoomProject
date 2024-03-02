#include "Settings.h"
#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ArduinoJson.h>
#include <ArduinoMqttClient.h>
#include <EEPROM.h>
#include "dataObject.h"

WiFiClient wifiClient;
MqttClient mqttClient(wifiClient);

// setup
void setupWifi();
void setupMqtt();
bool createDevices();

// uuid stuff
void readUUID();
void writeUUID();
void clearUUID();
boolean getUUID();

// mqtt stuff
void onMqttMessage(int messageSize);
void sendIsConnected();
void updateServer(int dataIndex);


void setup() {
    //set pins
    //begin eeprom and serial

    //setup wifi
    //setup mqtt
    //config setup

    //check if config is ok
}

void loop() {

}