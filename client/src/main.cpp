#include "Settings.h"
#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ArduinoJson.h>
#include <ArduinoMqttClient.h>
#include <EEPROM.h>
#include "dataObject.h"

WiFiClient wifiClient;
MqttClient mqttClient(wifiClient);

char uuid[37] = {'\0'};
char topic[72] = {'\0'};

// consts
const int DV_NO_DEVICE = 0;
const int DV_SEND_REQUEST = 1;
const int DV_IS_DEVICE = 2;
int state = DV_NO_DEVICE;

const int DEVICE_TOPIC_CHANGE = 0;
const int CHECK_IS_CONNECTED = 1;
const int DEVICE_DATA_CHANGE = 2;
const int DATA_CHANGE = 3;

bool isError = false;
bool isResetPressed = false;

void setup_wifi();
bool createDevices();
void setRedLed(bool newState);
bool sendHttpPostRequest(char *path, char *json);
boolean checkData();
boolean getUUID();
boolean setUpDevice();
boolean updateTopicPath();
bool setUpMqtt();
boolean initData(int dataAt);
void subTopics();
void unSubTopics();
void onMqttMessage(int messageSize);
void sendIsConnected();
void updateServer(int dataAt, int dataType);
void clearUUID();

void checkHardware()
{
}

void updateServer(int dataAt, int dataType)
{
    StaticJsonDocument<192> doc;
    // JsonObject root = doc.to<JsonObject>(); //TODO: uncomment this if the function does probelms and remove comment if it doesn't
    doc.createNestedObject("data");
    doc["sender"].set(uuid);
    doc["dataType"].set(dataType);
    doc["dataAt"].set(dataAt);
    doc["event"].set(1);
    doc["receiver"].set("server");
    deviecDataArr[dataAt]->getData(doc["data"]);

    char data[192];
    serializeJson(doc, data);

    mqttClient.beginMessage(topic); // topic
    mqttClient.print(data);
    mqttClient.endMessage();

    Serial.println("send update");

    doc.clear();
}

void setup()
{
    pinMode(RESET_DEVICE_PIN, INPUT_PULLUP);

    EEPROM.begin(512);
    Serial.begin(115200);

    setup_wifi();
    extra_setup();

    // check if devices can be created and if not stall the device
    if (!createDevices())
    {
        setRedLed(true);
        while (true)
            ;
    }
    setRedLed(true);
}

void loop()
{
    if (isError)
    {
        state = DV_NO_DEVICE;
        isError = false;
    }

    if (state == DV_NO_DEVICE)
    // didn't get data from server
    {
        if (getUUID())
        {
            Serial.println(uuid);
            state = DV_SEND_REQUEST;
        }
        else
        {
            setRedLed(true);
            isError = true;
        }
    }
    else if (state == DV_SEND_REQUEST)
    // getting data from server and connecting to mqtt broker
    {
        // get data
        if (setUpDevice())
        {
            if (setUpMqtt())
            {
                state = DV_IS_DEVICE;
                setRedLed(false);
            }
            else
            {
                setRedLed(true);
                isError = true;
            }
        }
        else
        {
            setRedLed(true);
            isError = true;
        }
    }
    else
    // connected to server and operating
    {
        mqttClient.poll();
        checkHardware();
        extra_loop();
    }

    // Reset switch logic
    // TODO: convert to interupt
    if (digitalRead(RESET_DEVICE_PIN) == LOW && !isResetPressed)
    {
        isResetPressed = true;
        clearUUID();
        setRedLed(true);
        state = DV_NO_DEVICE;
    }
    if (digitalRead(RESET_DEVICE_PIN) == HIGH)
    {
        isResetPressed = false;
    }
}

void setup_wifi()
{
    WiFi.mode(WIFI_STA);
    WiFi.begin(wifi_ssid, wifi_password);

    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.print(".");
    }

    Serial.println(F(""));
    Serial.println(F("WiFi connected"));
    Serial.println(F("IP address: "));
    Serial.println(WiFi.localIP());
}

bool createDevices()
{
    // TODO: add all the other device types
    for (size_t i = 0; i < deviceTypeCount; i++)
    {
        switch (deviceType[i])
        {
        case 0:
            // DEL
            // deviecDataArr[i] = new AcDataType(0, i);
            break;
        case 1:
            // SWITCH_TYPE on server
            deviecDataArr[i] = new SwitchData(1, i, "isOn");
            break;
        case 2:
            // NUMBER_TYPE on server
            deviecDataArr[i] = new NumberData(2, i, "number");
            break;
        case 3:
            // MULTI_STATE_BUTTON_TYPE on server
            deviecDataArr[i] = new NumberData(3, i, "currentState");
            break;
        }

        deviecDataArr[i]->setOnUpdateCallback(updateServer);
        deviecDataArr[i]->setOnSetCallback(onSetArray[i]);
    }

    return 1;
}

void setRedLed(bool newState)
{
    // redLedStateCur = newState;
    // digitalWrite(red_led_pin, !newState);
    // digitalWrite(green_led_pin, !newState);
}

void readUUID()
{
    EEPROM.get(0, uuid);
    Serial.println("read UUID form eeprom");
    uuid[36] = '\0';
}

void writeUUID()
{
    EEPROM.put(0, uuid);

    EEPROM.end();
    Serial.println("wrote UUID to eeprom");
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

    // use https://arduinojson.org/v6/assistant to calculate the proper size for the arrays
    char deviceTypeArray[1536];
    DynamicJsonDocument doc(1536);
    // StaticJsonDocument<1536> doc;
    JsonObject root = doc.to<JsonObject>();
    JsonArray arr = root.createNestedArray("deviceType");
    root.createNestedArray("extraConfigurations");

    doc["deviceName"] = device_name;

    for (size_t i = 0; i < sizeof(deviceType) / sizeof(deviceType[0]); i++)
    {
        arr.add(deviceType[i]);
        Serial.println(deviceType[i]);
    }
    setUpExtraArrayForDeviceCreation(root);

    serializeJson(doc, deviceTypeArray);

    if (!sendHttpPostRequest("/api/device/registerNewDevice", deviceTypeArray))
    {
        Serial.println("failed to send getUUID request to server");
        return 0;
    }

    doc.clear();

    if (!checkData())
    {
        Serial.println("wrong data");
        return 0;
    }

    wifiClient.readBytes(uuid, 36);
    uuid[36] = '\0';
    writeUUID();
    wifiClient.stop();

    return 1;
}

bool sendHttpPostRequest(char *path, char *json)
{
    char tempString[75] = {'\0'};
    if (wifiClient.connect(broker, 5000))
    {
        strcat(tempString, "POST ");
        strcat(tempString, path);
        strcat(tempString, " HTTP/1.1");

        wifiClient.println(tempString);
        wifiClient.println(("Host: " + String(serverip) + ":" + String(server_port)));
        wifiClient.println(("Connection: close"));
        wifiClient.println(("Accept: */*"));

        wifiClient.println("Content-Length: " + String(strlen(json)));
        wifiClient.println(("Content-Type: application/json"));
        wifiClient.println();

        wifiClient.println(json);

        Serial.println(tempString);

        return 1;
    }

    return 0;
}

bool sendHttpGetRequest(char *path, bool addUUID, char *extraPathVariables)
{
    char tempString[75] = {'\0'};
    if (wifiClient.connect(broker, 5000))
    {
        strcpy(tempString, "GET ");
        strcat(tempString, path);
        if (addUUID || strcmp(extraPathVariables, "") != 0)
        {
            strcat(tempString, "?");
        }
        if (addUUID)
        {
            strcat(tempString, "uuid=");
            strcat(tempString, uuid);
            if (strcmp(extraPathVariables, "") != 0)
            {
                strcat(tempString, "&");
            }
        }
        if (strcmp(extraPathVariables, "") != 0)
        {
            strcat(tempString, extraPathVariables);
        }
        strcat(tempString, " HTTP/1.1");

        wifiClient.println(tempString);
        // TODO: change this to use variables
        wifiClient.println(("Host: 10.0.0.12:5000"));
        wifiClient.println(("Connection: close"));
        wifiClient.println(("Accept: */*"));
        wifiClient.println();
        Serial.println(tempString);

        return 1;
        Serial.println("send HTTP request");
    }

    return 0;
}

boolean checkData()
{
    char status[32] = {0};
    wifiClient.readBytesUntil('\r', status, sizeof(status));
    Serial.println(status);

    // Check HTTP status
    if (strcmp(status, "HTTP/1.1 200 OK") != 0)
    {
        Serial.print(F("Unexpected response: "));
        Serial.println(status);
        wifiClient.stop();
        return 0;
    }

    // Skip HTTP headers
    char endOfHeaders[] = "\n\r\n";
    if (!wifiClient.find(endOfHeaders))
    {
        Serial.println(F("Invalid response"));
        wifiClient.stop();
        return 0;
    }
    return 1;
}

boolean setUpDevice()
{
    // get data
    for (size_t dataAt = 0; dataAt < sizeof(deviceType) / sizeof(deviceType[0]); dataAt++)
    {
        Serial.println(dataAt);

        char extraPathVariables[12] = {'\0'};
        sprintf(extraPathVariables, "dataat=%d", dataAt);
        if (!sendHttpGetRequest("/api/device/getData", true, extraPathVariables))
        {
            return 0;
        }
        if (!checkData())
        {
            return 0;
        }
        if (!initData(dataAt))
        {
            return 0;
        }
        wifiClient.stop();
    }

    if (!sendHttpGetRequest("/api/device/getTopic", true, ""))
    {
        return 0;
    }
    if (!checkData())
    {
        return 0;
    }
    if (!updateTopicPath())
    {
        return 0;
    }
    wifiClient.stop();

    return 1;
}

boolean initData(int dataAt)
{
    StaticJsonDocument<512> doc;

    DeserializationError error;
    error = deserializeJson(doc, wifiClient);

    if (error)
    {
        setRedLed(true);
        Serial.println(error.f_str());
        return 0;
    }

    JsonObject data = doc["data"];

    if (deviecDataArr[dataAt]->getDataType() == deviceType[dataAt])
    {
        deviecDataArr[dataAt]->setData(data);
    }

    doc.clear();
    Serial.println("updated data at: ");
    Serial.print(dataAt);
    Serial.print(" of type: ");
    Serial.println(deviceType[dataAt]);
    Serial.println();
    setRedLed(false);
    return 1;
}

boolean updateTopicPath()
{
    StaticJsonDocument<512> doc;

    DeserializationError error = deserializeJson(doc, wifiClient);

    if (error)
    {
        setRedLed(true);
        Serial.print(F("deserializeJson() failed: "));
        Serial.println(error.f_str());
        return 0;
    }

    unSubTopics();

    strcpy(topic, doc["topicPath"]);

    Serial.print(F("updated topic path"));
    doc.clear();
    setRedLed(false);
    return 1;
}

void unSubTopics()
{
    mqttClient.unsubscribe(topic);
}

void subTopics()
{
    mqttClient.subscribe(topic);
}

bool setUpMqtt()
{
    if (!mqttClient.connect(broker, port))
    {
        Serial.println(mqttClient.connectError());
        return 0;
        while (1)
            ;
    }
    Serial.println(F("connected to mqtt server"));
    mqttClient.onMessage(onMqttMessage);
    subTopics();
    mqttClient.subscribe("isConnectedCheckTopic");

    return 1;
}

void onMqttMessage(int messageSize)
{
    StaticJsonDocument<512> doc;
    byte data[512] = {0};
    mqttClient.readBytes(data, messageSize);

    DeserializationError error = deserializeJson(doc, data);

    if (error)
    {
        setRedLed(true);
        Serial.print(F("deserializeJson() failed: "));
        Serial.println(error.f_str());
        return;
    }

    const char *sender = doc["sender"];     // "server"
    const char *receiver = doc["receiver"]; // "server"
    int dataType = doc["dataType"];         // 0
    int dataAt = doc["dataAt"];             // 0
    int event = doc["event"];               // "checkConnection"

    if (strcmp(sender, "server") != 0)
    {
        return;
    }

    // Serial.println(dataType);
    // Serial.println(dataAt);
    // Serial.println(event);

    if (event == CHECK_IS_CONNECTED)
    {
        sendIsConnected();
    }

    if (strcmp(receiver, uuid) == 0 || strcmp(receiver, "*") == 0)
    {
        if (event == DATA_CHANGE)
        {
            JsonObject data = doc["data"];
            Serial.println(deviecDataArr[dataAt]->getDataType());
            Serial.println(dataType);
            if (deviecDataArr[dataAt]->getDataType() == dataType)
            {
                deviecDataArr[dataAt]->setData(data);
                Serial.println("data");
                Serial.println("updated data at: ");
                Serial.print(dataAt);
                Serial.print(" of type: ");
                Serial.print(deviceType[dataAt]);
                Serial.println();
            }
        }
        if (event == DEVICE_TOPIC_CHANGE)
        {
            unSubTopics();
            // TODO: stil not implemented in the back end
            // strcpy(topic, doc["topicPath"]);
            subTopics();
        }
    }

    setRedLed(false);
    doc.clear();
}

void sendIsConnected()
{
    StaticJsonDocument<192> doc;

    doc["sender"].set(uuid);
    doc["dataType"].set(-1);
    doc["dataAt"].set(-1);
    doc["event"].set(1);
    doc["receiver"].set("server");
    doc["data"].set("");

    char data[192];
    serializeJson(doc, data);
    // Serial.println(data);

    mqttClient.beginMessage("isConnectedCheckTopic"); // topic
    mqttClient.print(data);
    mqttClient.endMessage();

    Serial.println("send isConnected");

    doc.clear();
}