#include <ESP8266WiFi.h>
#include <ArduinoJson.h>
// #include "SoftwareSerial.h"
#include <ArduinoMqttClient.h>
#include "AcRemote.h"
#include <EEPROM.h>
#include "DeviceData.h"
#include "AcDataType.h"

DeviceData *acRemoteType(new AcDataType(0, 0));

const int deviceType[] = {0};

char *wifi_ssid = ("home");
char *wifi_password = ("0525611397");

const char broker[] = ("10.0.0.12");
int port = 1883;

WiFiClient wifiClient;
MqttClient mqttClient(wifiClient);

const int DV_NO_DEVICE = 0;
const int DV_SEND_REQUEST = 1;
const int DV_IS_DEVICE = 2;
int state = DV_NO_DEVICE;

char uuid[37] = "89e84f71-bd88-4b1f-867d-231bbdce3d72";

const int DEVICE_TOPIC_CHANGE = 0;
const int CHECK_IS_CONNECTED = 1;
const int DEVICE_DATA_CHANGE = 2;
const int DATA_CHANGE = 3;

char topic[72] = {'\0'};
const int deviceTypeCount = sizeof(deviceType) / sizeof(deviceType[0]);
DeviceData *deviecDataArr[deviceTypeCount];

bool createDevices()
{
    for (size_t i = 0; i < deviceTypeCount; i++)
    {
        switch (deviceType[i])
        {
        case 0:
            deviecDataArr[i] = new AcDataType(0, i);
            break;
        }
    }

    return 1;
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
void unSubTopics()
{
    mqttClient.unsubscribe(topic);
}

void subTopics()
{
    mqttClient.subscribe(topic);
}

void setUpMqtt()
{
    if (!mqttClient.connect(broker, port))
    {
        Serial.println(mqttClient.connectError());
        while (1)
            ;
    }
    Serial.println(F("connected to mqtt server"));
    mqttClient.onMessage(onMqttMessage);
    subTopics();
    mqttClient.subscribe("isConnectedCheckTopic");
}

void onMqttMessage(int messageSize)
{
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
            // add option for more then one data type
            JsonObject data = doc["data"];
            if (deviecDataArr[dataAt]->getDataType() == dataType)
            {
                deviecDataArr[dataAt]->setData(data);
                Serial.println("updated data at: ");
                Serial.print(dataAt);
                Serial.print(" of type: ");
                Serial.print(deviceType[dataAt]);
            }
        }
        if (event == DEVICE_TOPIC_CHANGE)
        {
            // IMPLEMENT
        }
    }

    doc.clear();
}

void sendIsConnected()
{
    StaticJsonDocument<192> doc;
    JsonObject root = doc.to<JsonObject>();

    doc["sender"].set(uuid);
    doc["dataType"].set(-1);
    doc["dataAt"].set(-1);
    doc["event"].set(1);
    doc["receiver"].set("server");
    doc["data"].set("");
    JsonArray arr = root.createNestedArray("arrValues");

    char data[192];
    serializeJson(doc, data);
    // Serial.println(data);

    mqttClient.beginMessage("isConnectedCheckTopic"); // topic
    mqttClient.print(data);
    mqttClient.endMessage();

    Serial.println("send isConnected");

    doc.clear();
}

void clearUUID()
{
    int addressIndex = 0;
    for (int i = 0; i < 37; i++)
    {
        EEPROM.write(i, 0);
    }
    EEPROM.end();
    Serial.println("cleared eeprom");
}

void writeUUID()
{
    Serial.println("asdasdasdasd");
    EEPROM.put(0, uuid);

    EEPROM.end();
    Serial.println("wrote UUID to eeprom");
}

void readUUID()
{
    EEPROM.get(0, uuid);
    Serial.println("read UUID form eeprom");
    uuid[36] = '\0';
}

boolean getUUID()
{

    readUUID();
    if (strlen(uuid) != 0)
    {
        return 1;
    }

    if (!sendHttpRequest(0))
    {
        Serial.println("failed to send getUUID request to server");
        return 0;
    }
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

boolean sendGetDataRequest(int dataAt)
{
    char tempString[75] = {'\0'};
    if (wifiClient.connect(broker, 5000))
    {
        sprintf(tempString, "GET /device/getData?uuid=%s&dataat=%d HTTP/1.1", uuid, dataAt);
        Serial.println(tempString);

        wifiClient.println(tempString);
        wifiClient.println(("Host: 10.0.0.12:5000"));
        wifiClient.println(("Connection: close"));
        wifiClient.println(("Accept: */*"));
        wifiClient.println();

        return 1;
        Serial.println("send getData HTTP request to server");
    }
    return 0;
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
            for (size_t i = 0; i < sizeof(deviceType) / sizeof(deviceType[0]); i++)
            {
                arr.add(deviceType[i]);
            }

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
        Serial.println("send HTTP request");
    }
    return 0;
}

boolean setUpDevice()
{
    // get data
    for (size_t i = 0; i < sizeof(deviceType) / sizeof(deviceType[0]); i++)
    {
        Serial.println(i);

        if (!sendGetDataRequest(i))
        {
            return 0;
        }
        if (!checkData())
        {
            return 0;
        }
        if (!updateData(i))
        {
            return 0;
        }
        wifiClient.stop();
    }

    if (!sendHttpRequest(2))
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

boolean updateData(int dataAt)
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

    if (deviecDataArr[dataAt]->getDataType() == deviceType[dataAt])
    {
        deviecDataArr[dataAt]->setData(data);
    }

    doc.clear();
    Serial.println("updated data at: ");
    Serial.print(dataAt);
    Serial.print(" of type: ");
    Serial.print(deviceType[dataAt]);
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

    Serial.print(F("updated topic path"));
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
    EEPROM.begin(512);
    Serial.begin(115200);
    setup_wifi();
    // TODO add if
    if (!createDevices())
    {
        while (true)
            ;
    }
    // clearUUID();
}

void loop()
{
    // TODO: add check to see if uuid is in eeprom and if so send request with only uuid if (state == DV_NO_DEVICE)
    if (state == DV_NO_DEVICE)
    {
        if (getUUID())
        {
            Serial.println(uuid);
            state = DV_SEND_REQUEST;
        }
    }
    else if (state == DV_SEND_REQUEST)
    {
        // get data
        if (setUpDevice())
        {
            setUpMqtt();
            state = DV_IS_DEVICE;
        }
    }
    else
    {
        mqttClient.poll();
    }

    // delay(2000);
}