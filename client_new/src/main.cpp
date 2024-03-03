#include "Settings.h"
#include "pinSettings.cpp"
#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ArduinoJson.h>
#include <ArduinoMqttClient.h>
#include <EEPROM.h>
#include "dataObject.h"

WiFiClient wifiClient;
MqttClient mqttClient(wifiClient);

char uuid[37] = {'\0'};

// setup
void setupWifi();
boolean setupMqtt();
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
void logToMqtt();
void subscribeTopics();
void unsubscribeTopics();
void setup()
{
    pinMode(RESET_DEVICE_PIN, INPUT_PULLUP);

    EEPROM.begin(512);
    Serial.begin(115200);

    setupWifi();
    setupMqtt();
    // config setup

    // check if config is ok
}

void loop()
{
    if (!mqttClient.connected())
    {
        setupMqtt();
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
    Serial.println(WiFi.localIP());

    WiFi.setAutoReconnect(true);
    // WiFi.persistent(true);
}

// mqtt stuff

boolean setupMqtt()
{
    if (!mqttClient.connect(brokerIp, brokerPort))
    {
        Serial.println(mqttClient.connectError());
        return 1;
        // setupMqtt()
        // while (1)
        //     ;
    }
    Serial.println(F("connected to mqtt server"));
    mqttClient.subscribe(connectionCheckRequestTopic);
    mqttClient.onMessage(onMqttMessage);
    subscribeTopics();
    return 0;
}

void onMqttMessage(int messageSize) {

}

void subscribeTopics() {
    
}

void unsubscribeTopics() {
    
}

// eerpom
void readUUID() {
    EEPROM.get(0, uuid);
    Serial.println("read UUID form eeprom");
    uuid[36] = '\0';
}

void writeUUID() {
    EEPROM.put(0, uuid);
    EEPROM.end();
    Serial.println("wrote UUID to eeprom");
}

void clearUUID(){
    for (int i = 0; i < 37; i++)
    {
        EEPROM.write(i, 0);
    }
    EEPROM.end();
    const char *empty = "";
    strcpy(uuid, empty);
    Serial.println("cleared eeprom");
}

boolean getUUID() {
    
}