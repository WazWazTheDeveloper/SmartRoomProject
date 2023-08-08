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

char publishToTopic[2][60] =
    {
        '\0',
        '\0'}; // arduino listen to this
char listenToToTopic[60] = {'\0'};

void setup_wifi()
{
  WiFi.mode(WIFI_STA);
  WiFi.begin(wifi_ssid, wifi_password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void subTopics()
{
    for (size_t i = 0; i < 2; i++)
    {
        if (strlen(publishToTopic[i]) != 0)
        {
            mqttClient.subscribe(publishToTopic[i]);
        }
    }
    if (strlen(listenToToTopic) != 0)
    {
        mqttClient.subscribe(listenToToTopic);
    }
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
    Serial.println("mqttClient.connectError()");
    mqttClient.onMessage(onMqttMessage);
    subTopics();
    mqttClient.subscribe("/1");
    // mqttClient.subscribe("/test");
    Serial.println(("ye"));
}

void onMqttMessage(int messageSize)
{
    // Serial.println(F("ye"));
    // String s = "";
    // we received a message, print out the topic and contents
    // Serial.println("Received a message with topic '");
    Serial.print(mqttClient.messageTopic());
    // Serial.print("', length ");
    Serial.print(messageSize);
    // Serial.println(" bytes:");

    // use the Stream interface to print the contents
    // while (mqttClient.available())
    // {
    //   s.concat((char)mqttClient.read());
    // }
    // Serial.println();
    // Serial.println(s);

    // StaticJsonDocument<500> doc;
    // DeserializationError error = deserializeJson(doc, s);

    // // Test if parsing succeeds.
    // if (error)
    // {
    //   // Serial.print(F("deserializeJson() failed: "));
    //   Serial.println(error.f_str());
    //   return;
    // }
    // int l = doc[("temp")];
    // Serial.println(l);

    // doc.clear();
}

void writeUUID()
{
    int addressIndex = 0;
    for (int i = 0; i < 36; i++)
    {
        EEPROM.write(addressIndex+i, uuid[i]);
        // EEPROM.write(addressIndex + 1, uuid[i] & 0xFF);
        // addressIndex += 2;
    }
}

void readUUID()
{
    int addressIndex = 0;
    for (int i = 0; i < 36; i++)
    {
        uuid[i] = EEPROM.read(addressIndex+i);
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
            strcpy(tempString, "POST /device/registerNewDevice?deviceType='0'");
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
                strcat(tempString, "getPublishTo");
            }
            else if (requestNumber == 3)
            {
                strcat(tempString, "getListenTo");
            }
            strcat(tempString, "?uuid=");
            strcat(tempString, uuid);
        }
        strcat(tempString, " HTTP/1.1");

        // Serial.println(tempString);
        wifiClient.println(tempString);
        wifiClient.println(("Host: 10.0.0.12:5000"));
        wifiClient.println(("Connection: close"));
        wifiClient.println(("Accept: */*"));
        wifiClient.println();

        return 1;
    }
    return 0;
}

void setUpDevice()
{

    // get data
    sendHttpRequest(1);
    checkData();
    updateData(0);
    wifiClient.stop();

    // TODO: get ListenTo
    sendHttpRequest(2);
    checkData();
    updateData(2);
    wifiClient.stop();

    // TODO: get PublishTo
    sendHttpRequest(3);
    checkData();
    updateData(3);
    wifiClient.stop();

    // Serial.println(uuid);
    // return 1;
}

boolean updateData(int8_t type)
{
    StaticJsonDocument<256> doc;
    DeserializationError error;

    if (type == 1)
    {
        error = deserializeJson(doc, mqttClient);
    }
    else
    {
        error = deserializeJson(doc, wifiClient);
    }

    if (error)
    {
        Serial.println(error.f_str());
        return 0;
    }

    if (type == 0 || type == 1)
    {
        bool isOn = doc["isOn"];             // false
        int temp = doc["temp"];              // 24
        int mode = doc["mode"];              // 0
        int speed = doc["speed"];            // 3
        bool swing1 = doc["swing1"];         // false
        bool swing2 = doc["swing2"];         // false
        int timer = doc["timer"];            // 0
        int fullhours = doc["fullhours"];    // 0
        bool isHalfHour = doc["isHalfHour"]; // false
        bool isStrong = doc["isStrong"];     // false
        bool isFeeling = doc["isFeeling"];   // false
        bool isSleep = doc["isSleep"];       // false
        bool isScreen = doc["isScreen"];     // true
        bool isHealth = doc["isHealth"];     // false

        // acRemote
        //     .setIsOn(isOn)
        //     .setTemp(temp)
        //     .setMode(mode)
        //     .setSpeed(speed)
        //     .setSwing1(swing1)
        //     .setSwing2(swing2)
        //     .setTimer(timer)
        //     .setIsStrong(isStrong)
        //     .setIsFeeling(isFeeling)
        //     .setIsSleep(isSleep)
        //     .setIsHealth(isHealth)
        //     .execute();

        // acRemote
        //     .setIsOn(doc["isOn"]].as<bool>())
        //     .setTemp(doc[("b")].as<int>())
        //     .setMode(doc[("c")].as<int>())
        //     .setSpeed(doc[("d")].as<int>())
        //     .setSwing1(doc[("e")].as<bool>())
        //     .setSwing2(doc[("f")].as<bool>())
        //     .setTimer(doc[("g")].as<int>())
        //     .setIsStrong(doc[("h")].as<bool>())
        //     .setIsFeeling(doc[("i")].as<bool>())
        //     .setIsSleep(doc[("g")].as<bool>())
        //     .setIsHealth(doc[("k")].as<bool>())
        //     .execute();
    }
    else if (type == 2 || type == 3)
    {
        // serializeJson(json , Serial);
        for (int8_t i = 0; i < doc[("arr")].size(); i++)
        {
            const char *arr_i = doc[("arr")][i]; // "1"
            if (type == 2)
            {
                mqttClient.unsubscribe(publishToTopic[i]);
                strcpy(publishToTopic[i], arr_i);
                // Serial.println("arr_0");
                // Serial.println(publishToTopic[i]);
            }
            else
            {
                mqttClient.unsubscribe(listenToToTopic);
                strcpy(listenToToTopic, arr_i);
            }
        }
    }

    subTopics(); 
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
        Serial.print(("Unexpected response: "));
        Serial.println(status);
        wifiClient.stop();
        return 0;
    }

    // Skip HTTP headers
    char endOfHeaders[] = "\n\r\n";
    if (!wifiClient.find(endOfHeaders))
    {
        Serial.println(("Invalid response"));
        wifiClient.stop();
        return 0;
    }
    return 1;
}

void setup()
{
    EEPROM.begin(sizeof(char)*37);
    Serial.begin(115200);
    //   ESPSERIAL.begin(9600);
    // acRemote.begin();
    // delay(5000);
    setup_wifi();
}

void loop()
{
    // TODO: add check to see if uuid is in eeprom and if so send request with only uuid if (state == DV_NO_DEVICE)
    if (state == DV_NO_DEVICE)
    {
        getUUID();
        Serial.println(uuid);
        // state = DV_SEND_REQUEST;
    }
    else if (state == DV_SEND_REQUEST)
    {
        // get data
        // setUpDevice();

        // state = DV_IS_DEVICE;
        // setUpMqtt();
    }
    // else
    // {
        mqttClient.poll();
    // }
    delay(1000);
    // Serial.println(WiFi.localIP());
}