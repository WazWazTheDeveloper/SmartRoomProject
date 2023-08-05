#include "WiFiEsp.h"
#include <ArduinoJson.h>
#include "SoftwareSerial.h"
#include <ArduinoMqttClient.h>
#include "AcRemote.h"
#include <EEPROM.h>

SoftwareSerial ESPSERIAL(14, 15); // RX, TX
AcRemote acRemote = AcRemote();

char *wifi_ssid = "home";
char *wifi_password = "0525611397";
int status = WL_IDLE_STATUS;

const char broker[] = "10.0.0.12";
int port = 1883;

WiFiEspClient wifiClient;
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
  WiFi.init(&ESPSERIAL);

  // check for the presence of the shield
  // if (WiFi.status() == WL_NO_SHIELD)
  // {
  //   Serial.println(F("WiFi shield not present"));
  //   // don't continue
  //   while (true)
  //     ;
  // }

  // attempt to connect to WiFi network
  while (status != WL_CONNECTED)
  {
    // Serial.print(F("Attempting to connect to WPA SSID: "));
    // Serial.println(wifi_ssid);
    // Connect to WPA/WPA2 network
    status = WiFi.begin(wifi_ssid, wifi_password);
  }

  Serial.println(F("You're connected to the network"));
  // Serial.println("IP address: ");
  // Serial.println(WiFi.localIP());
}

void setUpMqtt()
{
  // Serial.println("1232");
  if (!mqttClient.connect(broker, port))
  {
    // Serial.print("MQTT connection failed! Error code = ");
    Serial.println(mqttClient.connectError());

    while (1)
      ;
  }
  mqttClient.onMessage(onMqttMessage);
  // Serial.println("You're connected to the MQTT broker!");
  // Serial.println();

  // Serial.print("Subscribing to topics: ");
  // for (int i = 0; i < strlen(*publishToTopic); i++)
  // {
  //   Serial.println(publishToTopic[i]);
  //   if (strlen(publishToTopic[i]) != 0)
  //   {
  //     mqttClient.subscribe(publishToTopic[i]);
  //   }
  // }

  // subscribe to a topic
  // mqttClient.subscribe("test");

  // topics can be unsubscribed using:
  // mqttClient.unsubscribe();
}

void onMqttMessage(int messageSize)
{
  // String s = "";
  // // we received a message, print out the topic and contents
  // // Serial.println("Received a message with topic '");
  // Serial.print(mqttClient.messageTopic());
  // // Serial.print("', length ");
  // Serial.print(messageSize);
  // // Serial.println(" bytes:");

  // // use the Stream interface to print the contents
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
    EEPROM.write(addressIndex, uuid[i] >> 8);
    EEPROM.write(addressIndex + 1, uuid[i] & 0xFF);
    addressIndex += 2;
  }
}

void readUUID()
{
  int addressIndex = 0;
  for (int i = 0; i < 36; i++)
  {
    uuid[i] = (EEPROM.read(addressIndex) << 8) + EEPROM.read(addressIndex + 1);
    addressIndex += 2;
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
  else
  {
    sendHttpRequest(0);
    checkData();
    wifiClient.readBytes(uuid, 36);
    uuid[36] = '\0';
    writeUUID();
  }
}

void sendHttpRequest(int8_t requestNumber)
{

  if (wifiClient.connect(broker, 5000))
  {
    switch (requestNumber)
    {
    case 0:
      wifiClient.println(F("POST /device/registerNewDevice?deviceType='0' HTTP/1.1"));
      break;
    case 1:
      wifiClient.println("GET /device/getData?uuid=" + String(uuid) + " HTTP/1.1");
      break;
    case 2:
      wifiClient.println("GET /device/getPublishTo?uuid=" + String(uuid) + " HTTP/1.1");
      break;
    case 3:
      wifiClient.println("GET /device/getListenTo?uuid=" + String(uuid) + " HTTP/1.1");
      break;
    }

    // wifiClient.println(("GET /device/getData?uuid=" + String(uuid) + "HTTP/1.1"));
    wifiClient.println(F("Host: 10.0.0.12:5000"));
    wifiClient.println(F("Connection: close"));
    wifiClient.println(F("Accept: */*"));
    wifiClient.println();
  }
}

boolean setUpDevice()
{

  // get data
  sendHttpRequest(1);
  checkData();
  updateData(0);

  // TODO: get ListenTo
  sendHttpRequest(2);
  checkData();
  updateData(2);
  // TODO: get PublishTo

  // Serial.println(uuid);
}

void updateData(int8_t type)
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
    return;
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

    doc.clear();
  }
  else if (type == 2 || type == 3)
  {
    JsonArray json = doc["arr"];
    for (int8_t i = 0; i < json.size(); i++)
    {
      if (type == 2)
      {
        strcpy(publishToTopic[i], json[i]);
      }
      else
      {
        strcpy(listenToToTopic, json[i]);
      }
    }
  }

  doc.clear();
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
  Serial.begin(115200);
  ESPSERIAL.begin(9600);
  acRemote.begin();
  setup_wifi();
}

void loop()
{
  // mqttClient.poll();
  // //TODO: add check to see if uuid is in eeprom and if so send request with only uuid if (state == DV_NO_DEVICE)
  if (state == DV_NO_DEVICE)
  {
    getUUID();
    // Serial.println(uuid);
    // sendNewDeviceRequest();
    state = DV_SEND_REQUEST;
  }
  else if (state == DV_SEND_REQUEST)
  {
    // while (wifiClient.available())
    // {
    //   Serial.print(char(wifiClient.read()));
    // }

    // checkData();
    setUpDevice();
    // while (wifiClient.available())
    // {
    //   Serial.print(char(wifiClient.read()));
    // }
    // Serial.println("XXX");

    // state = DV_IS_DEVICE;
  }
  else if (state == DV_IS_DEVICE)
  {
    setUpMqtt();
    //   state = 4;
  }
  // else
  // {
  //   Serial.println("cc");
  // }
}