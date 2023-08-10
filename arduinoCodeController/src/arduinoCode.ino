#include <ESP8266WiFi.h>
#include <ArduinoJson.h>
// #include "SoftwareSerial.h"
#include <ArduinoMqttClient.h>
#include "AcRemote.h"
#include <EEPROM.h>

// SoftwareSerial ESPSERIAL(14, 15); // RX, TX
AcRemote acRemote = AcRemote();

char *wifi_ssid = ("home");
char *wifi_password = ("0525611397");
// int status = WL_IDLE_STATUS;

const char broker[] = ("10.0.0.12");
int port = 1883;

// WiFiEspClient wifiClient;
WiFiClient wifiClient;
MqttClient mqttClient(wifiClient);

const int DV_NO_DEVICE = 0;
const int DV_SEND_REQUEST = 1;
const int DV_IS_DEVICE = 2;
int state = DV_NO_DEVICE;

char uuid[37];

const int DEVICE_TOPIC_CHANGE = 0;
const int CHECK_IS_CONNECTED = 1;
const int DEVICE_DATA_CHANGE = 2;
const int DATA_CHANGE = 3;

char topic[72] =
    {'\0'}; // arduino listen to this

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
void unSubTopics()
{
    mqttClient.unsubscribe(topic);

    // for (size_t i = 0; i < 2; i++)
    // {
    //     if (strlen(publishToTopic[i]) != 0)
    //     {
    //         mqttClient.unsubscribe(publishToTopic[i]);
    //     }
    // }
}

void subTopics()
{
    mqttClient.subscribe(topic);
    // for (size_t i = 0; i < 2; i++)
    // {
    //     if (strlen(publishToTopic[i]) != 0)
    //     {
    //         Serial.println(publishToTopic[i]);
    //         Serial.println(mqttClient.subscribe(publishToTopic[i]));
    //     }
    // }

    // for (size_t i = 0; i < 2; i++)
    // {
    //     if (strlen(listenToToTopic[i]) != 0)
    //     {
    //         Serial.println(listenToToTopic[i]);
    //         mqttClient.subscribe(listenToToTopic[i]);
    //     }
    // }
    // Serial.println(mqttClient.subscribe(("/device/614c0e2d-c5aa-4320-98a1-ca5490f74a98")));
    // Serial.println(ESP.getFreeHeap());
}

void setUpMqtt()
{
    // Serial.println(F("ye"));
    if (!mqttClient.connect(broker, port))
    {
        Serial.println(mqttClient.connectError());
        while (1)
            ;
    }
    Serial.println(F("mqttClient.connectError()"));
    mqttClient.onMessage(onMqttMessage);
    subTopics();
    Serial.println(mqttClient.subscribe("isConnectedCheckTopic"));
    Serial.println(F("ye"));
}

void onMqttMessage(int messageSize)
{
    // massge will look like this:
    //  {"sender": "server","dataType": 0,"dataAt": 0,"event": "checkConnection","data": [{"isOn": true,"temp": 25,"mode": 0,"speed": 3,"swing1": true,"swing2": false,"timer": 0,"fullhours": 0,"isHalfHour": false,"isStrong": false,"isFeeling": false,"isSleep": false,"isScreen": true,"isHealth": false}]}

    StaticJsonDocument<512> doc;
    byte data[512] = {0};
    mqttClient.readBytes(data, messageSize);

    DeserializationError error = deserializeJson(doc, data);

    if (error)
    {
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

    Serial.println(dataType);
    Serial.println(dataAt);
    Serial.println(event);

    if (event == CHECK_IS_CONNECTED)
    {
        sendIsConnected();
    }

    if (strcmp(sender, uuid) == 0 || strcmp(sender, "*") == 0)
    {
        if (event == DATA_CHANGE)
        {
            // add option for more then one data type
            JsonObject data = doc["data"][0];
            updateData(data);
        }
    }
    doc.clear();
}

void sendIsConnected()
{
    Serial.println("data");
    StaticJsonDocument<192> doc;
    JsonObject root = doc.to<JsonObject>();

    doc["sender"].set(uuid);
    doc["dataType"].set(-1);
    doc["dataAt"].set(-1);
    doc["event"].set("checkConnection");
    JsonArray arr = root.createNestedArray("arrValues");

    char data[192];
    serializeJson(doc, data);
    Serial.println(data);
    Serial.println(strlen(data));

    mqttClient.beginMessage("isConnectedCheckTopic"); // topic
    mqttClient.print(data);
    mqttClient.endMessage();

    doc.clear();
}

void clearUUID()
{
    int addressIndex = 0;
    for (int i = 0; i < 36; i++)
    {
        EEPROM.write(addressIndex + i, 0);
    }
}

void writeUUID()
{
    int addressIndex = 0;
    for (int i = 0; i < 36; i++)
    {
        EEPROM.write(addressIndex + i, uuid[i]);
        // EEPROM.write(addressIndex + 1, uuid[i] & 0xFF);
        // addressIndex += 2;
    }
}

void readUUID()
{
    int addressIndex = 0;
    for (int i = 0; i < 36; i++)
    {
        uuid[i] = EEPROM.read(addressIndex + i);
        // Serial.println(EEPROM.read(addressIndex+1));
        // addressIndex += 2;
    }
    uuid[36] = '\0';
}

void getUUID()
{
    readUUID();
    if (strlen(uuid) != 0)
    {
        return;
    }
    sendHttpRequest(0);
    checkData();
    wifiClient.readBytes(uuid, 36);
    uuid[36] = '\0';
    writeUUID();
    wifiClient.stop();
}

boolean sendHttpRequest(int8_t requestNumber)
{
    char tempString[75] = {'\0'};
    if (wifiClient.connect(broker, 5000))
    {
        if (requestNumber == 0)
        {
            strcpy(tempString, "POST /device/registerNewDevice");
        }
        else
        {
            strcpy(tempString, ("GET /device/"));
            if (requestNumber == 1)
            {
                strcat(tempString, "getData");
            }
            else if (requestNumber == 2)
            {
                strcat(tempString, "getTopic");
            }
            strcat(tempString, "?uuid=");
            strcat(tempString, uuid);
        }
        strcat(tempString, " HTTP/1.1");

        wifiClient.println(tempString);
        wifiClient.println(("Host: 10.0.0.12:5000"));
        wifiClient.println(("Connection: close"));
        wifiClient.println(("Accept: */*"));

        if (requestNumber == 0)
        {
            char output[96];
            StaticJsonDocument<96> doc;
            JsonObject root = doc.to<JsonObject>();
            JsonArray arr = root.createNestedArray("deviceType");
            arr.add(0);
            serializeJson(doc, output);

            // this is json
            wifiClient.println("Content-Length: " + String(strlen(output)));
            wifiClient.println(("Content-Type: application/json"));
            wifiClient.println();

            wifiClient.println(output);
            doc.clear();
        }
        else
        {
            wifiClient.println();
        }

        return 1;
    }
    return 0;
}

void setUpDevice()
{

    // get data
    sendHttpRequest(1);
    checkData();
    updateData();
    wifiClient.stop();

    sendHttpRequest(2);
    checkData();
    updateTopicPath();
    wifiClient.stop();

    // Serial.println(uuid);
    // return 1;
}

boolean updateData(JsonObject &data)
{
    bool isOn = data["isOn"];             // false
    int temp = data["temp"];              // 24
    int mode = data["mode"];              // 0
    int speed = data["speed"];            // 3
    bool swing1 = data["swing1"];         // false
    bool swing2 = data["swing2"];         // false
    int timer = data["timer"];            // 0
    int fullhours = data["fullhours"];    // 0
    bool isHalfHour = data["isHalfHour"]; // false
    bool isStrong = data["isStrong"];     // false
    bool isFeeling = data["isFeeling"];   // false
    bool isSleep = data["isSleep"];       // false
    bool isScreen = data["isScreen"];     // true
    bool isHealth = data["isHealth"];     // false

    acRemote
        .setIsOn(isOn)
        .setTemp(temp)
        .setMode(mode)
        .setSpeed(speed)
        .setSwing1(swing1)
        .setSwing2(swing2)
        .setTimer(timer)
        .setIsStrong(isStrong)
        .setIsFeeling(isFeeling)
        .setIsSleep(isSleep)
        .setIsHealth(isHealth)
        .execute();

    Serial.println(acRemote.getTemp());

    return 1;
}

boolean updateData()
{
    StaticJsonDocument<512> doc;

    DeserializationError error;
    error = deserializeJson(doc, wifiClient);

    if (error)
    {
        Serial.println(error.f_str());
        return 0;
    }

    JsonArray dataArr = doc["deviceData"];
    JsonObject data = dataArr[0];

    bool isOn = data["isOn"];             // false
    int temp = data["temp"];              // 24
    int mode = data["mode"];              // 0
    int speed = data["speed"];            // 3
    bool swing1 = data["swing1"];         // false
    bool swing2 = data["swing2"];         // false
    int timer = data["timer"];            // 0
    int fullhours = data["fullhours"];    // 0
    bool isHalfHour = data["isHalfHour"]; // false
    bool isStrong = data["isStrong"];     // false
    bool isFeeling = data["isFeeling"];   // false
    bool isSleep = data["isSleep"];       // false
    bool isScreen = data["isScreen"];     // true
    bool isHealth = data["isHealth"];     // false

    acRemote
        .setIsOn(isOn)
        .setTemp(temp)
        .setMode(mode)
        .setSpeed(speed)
        .setSwing1(swing1)
        .setSwing2(swing2)
        .setTimer(timer)
        .setIsStrong(isStrong)
        .setIsFeeling(isFeeling)
        .setIsSleep(isSleep)
        .setIsHealth(isHealth)
        .execute();

    // subTopics();
    doc.clear();
    return 1;
}

boolean updateTopicPath()
{
    StaticJsonDocument<512> doc;

    // TODO: add check to also use mqtt
    DeserializationError error = deserializeJson(doc, wifiClient);

    if (error)
    {
        Serial.print(F("deserializeJson() failed: "));
        Serial.println(error.f_str());
        return 0;
    }

    unSubTopics();

    strcpy(topic, doc["topicPath"]);
    // int8 i = 0;
    // for (JsonObject listenTo_item : doc["listenTo"].as<JsonArray>())
    // {

    //     const char *listenTo_item_topicPath = listenTo_item["topicPath"];
    //     int listenTo_item_dataType = listenTo_item["dataType"];   // 0, 0
    //     const char *listenTo_item_event = listenTo_item["event"]; // "updateSettings", "updateSettings"
    //     strcpy(listenToToTopic[i], listenTo_item_topicPath);
    //     i++;
    // }

    // i = 0;
    // for (JsonObject publishTo_item : doc["publishTo"].as<JsonArray>())
    // {

    //     const char *publishTo_item_topicPath = publishTo_item["topicPath"];
    //     int publishTo_item_dataType = publishTo_item["dataType"];   // 0, 0
    //     const char *publishTo_item_event = publishTo_item["event"]; // "updateSettings", "updateSettings"

    //     strcpy(publishToTopic[i], publishTo_item_topicPath);
    //     i++;
    // }

    // subTopics();

    doc.clear();
    return 1;
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

void setup()
{
    EEPROM.begin(sizeof(char) * 37);
    Serial.begin(115200);
    //   ESPSERIAL.begin(9600);
    acRemote.begin();
    setup_wifi();

    int addressIndex = 0;
    for (int i = 0; i < 36; i++)
    {
        EEPROM.write(addressIndex + i, 0);
    }
}

void loop()
{
    // TODO: add check to see if uuid is in eeprom and if so send request with only uuid if (state == DV_NO_DEVICE)
    if (state == DV_NO_DEVICE)
    {
        getUUID();
        Serial.println(uuid);
        state = DV_SEND_REQUEST;
    }
    else if (state == DV_SEND_REQUEST)
    {
        // get data
        setUpDevice();

        setUpMqtt();
        state = DV_IS_DEVICE;
    }
    else
    {
        mqttClient.poll();
    }
}