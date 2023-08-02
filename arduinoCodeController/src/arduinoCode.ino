#include "WiFiEsp.h"
#include <ArduinoJson.h>
#include "SoftwareSerial.h"
#include <ArduinoMqttClient.h>

SoftwareSerial ESPSERIAL(14, 15); // RX, TX

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

void setup_wifi()
{
  WiFi.init(&ESPSERIAL);

  // check for the presence of the shield
  if (WiFi.status() == WL_NO_SHIELD)
  {
    Serial.println(F("WiFi shield not present"));
    // don't continue
    while (true)
      ;
  }

  // attempt to connect to WiFi network
  while (status != WL_CONNECTED)
  {
    Serial.print(F("Attempting to connect to WPA SSID: "));
    Serial.println(wifi_ssid);
    // Connect to WPA/WPA2 network
    status = WiFi.begin(wifi_ssid, wifi_password);
  }

  Serial.println(F("You're connected to the network"));
  // Serial.println("IP address: ");
  // Serial.println(WiFi.localIP());
}

void sendNewDeviceRequest()
{
  char output[256];
  DynamicJsonDocument doc(256);
  JsonArray deviceType = doc.createNestedArray(F("deviceType"));
  deviceType.add(0);
  serializeJsonPretty(doc, output);

  if (wifiClient.connect(broker, 5000))
  {
    Serial.println(F("Connected to server"));
    // Make a HTTP request
    wifiClient.println(F("POST /device/registerNewDevice HTTP/1.1"));
    wifiClient.println(F("Host: 10.0.0.12:5000"));
    wifiClient.println(F("Accept: */*"));
    wifiClient.println("Content-Length: " + String(strlen(output)));
    wifiClient.println(F("Content-Type: application/json"));
    wifiClient.println();
    wifiClient.print(output);
  }
}

void setUpDevice(char *response)
{
  // Serial.println(response);
  // // TODO: add a calculation to get the correct size for doc and char array
  // char charArray[2048];
  // StaticJsonDocument<2048> doc;
  // DeserializationError err = deserializeJson(doc, response);
  // Serial.println("err.f_str()");
  // Serial.println(err.f_str());
  // const char *sensor = doc["uuid"];
  // JsonArray lightstates = doc["publishTo"];
  // JsonObject sensor1 = lightstates[0];
  // const char *sensor12 = sensor1["topicPath"];
  // Serial.println(sensor);
  // Serial.println("sensor");
  // Serial.println(sensor12);

  // delay(10000);
}

// TODO: delete later
// int getContentLength()
// {
//   boolean isNum = false;
//   String num;
//   while (wifiClient.available())
//   {
//     char c = wifiClient.read();
//     if (isNum)
//     {
//       if (c == '\n')
//       {
//         return (num.toInt());
//       }
//       num.concat(c);
//     }
//     else
//     {
//       if (c == 'C')
//       {
//         c = wifiClient.read();
//         if (c == 'o')
//         {
//           c = wifiClient.read();
//           if (c == 'n')
//           {
//             c = wifiClient.read();
//             if (c == 't')
//             {
//               c = wifiClient.read();
//               if (c == 'e')
//               {
//                 c = wifiClient.read();
//                 if (c == 'n')
//                 {
//                   c = wifiClient.read();
//                   if (c == 't')
//                   {
//                     c = wifiClient.read();
//                     if (c == '-')
//                     {
//                       c = wifiClient.read();
//                       if (c == 'L')
//                       {
//                         c = wifiClient.read();
//                         if (c == 'e')
//                         {
//                           c = wifiClient.read();
//                           if (c == 'n')
//                           {
//                             c = wifiClient.read();
//                             if (c == 'g')
//                             {
//                               c = wifiClient.read();
//                               if (c == 't')
//                               {
//                                 c = wifiClient.read();
//                                 if (c == 'h')
//                                 {
//                                   c = wifiClient.read();
//                                   if (c == ':')
//                                   {
//                                     c = wifiClient.read();
//                                     isNum = true;
//                                   }
//                                 }
//                               }
//                             }
//                           }
//                         }
//                       }
//                     }
//                   }
//                 }
//               }
//             }
//           }
//         }
//       }
//     }
//   }
// }

void readData(char **buffer)
{
  char status[32] = {0};
  wifiClient.readBytesUntil('\r', status, sizeof(status));
  // Serial.println(status);

  // Check HTTP status
  if (strcmp(status, "HTTP/1.1 200 OK") != 0)
  {
    Serial.print(F("Unexpected response: "));
    Serial.println(status);
    wifiClient.stop();
    return;
  }

  // Skip HTTP headers
  char endOfHeaders[] = "\n\r\n";
  if (!wifiClient.find(endOfHeaders)) {
    Serial.println(F("Invalid response"));
    wifiClient.stop();
    return;
  }
    // Serial.println();

    // Serial.println(response);
  // TODO: add a calculation to get the correct size for doc and char array
  // while (wifiClient.available())
  // {
  //   Serial.print(char(wifiClient.read()));
  // }
  
  // char charArray[2048];
  DynamicJsonDocument  doc(1024);
  DeserializationError err = deserializeJson(doc, wifiClient);
  Serial.println("err.f_str()");
  Serial.println(err.f_str());
  // const char *sensor = doc["uuid"];
  // JsonArray lightstates = doc["publishTo"];
  // JsonObject sensor1 = lightstates[0];
  // const char *sensor12 = sensor1["topicPath"];
  // Serial.println(sensor);
  // Serial.println("sensor");
  // Serial.println(sensor12);

  delay(10000);
  // Serial.println("status");

  // uint16_t y = getContentLength();
  // *buffer = new char[y + 1];
  // boolean isBody = false;
  // while ((wifiClient.available()))
  // {

  //   if (isBody)
  //   {
  //     wifiClient.readBytes(*buffer, y);
  //     *buffer[y] = '\0';

  //     for (size_t i = 0; i < strlen(*buffer); i++)
  //     {
  //       if (*buffer[i] == '"')
  //       {
  //         *buffer[i] == '\"';
  //       }
  //     }
  //   }
  //   else
  //   {
  //     char c = wifiClient.read();
  //     if (c == '\n')
  //     {
  //       c = wifiClient.read();
  //       if (c == '\r')
  //       {
  //         c = wifiClient.read();
  //         if (c == '\n')
  //         {
  //           isBody = true;
  //         }
  //       }
  //     }
  //   }
  // }
}

void setup()
{
  Serial.begin(115200);
  ESPSERIAL.begin(9600);
  setup_wifi();
}

void loop()
{
  // mqttClient.poll();
  if (state == DV_NO_DEVICE)
  {
    sendNewDeviceRequest();
    state = DV_SEND_REQUEST;
  }
  else if (state == DV_SEND_REQUEST)
  {
    char *responseBody;
    readData(&responseBody);
    setUpDevice(responseBody);
    // if (responseBody != "")
    // {
    //   Serial.println("responseBody: ");
    //   Serial.println(responseBody);
    // }
  }
  else if (state == DV_IS_DEVICE)
  {
    /* code */
  }
}

// HTTP/1.1 200 OK
// X-Powered-By: Express
// Content-Type: application/json; charset=utf-8
// Content-Length: 609
// ETag: W/"261-fd3v1jJIep7mDWCfS0ctx8kaC6I"
// Date: Wed, 02 Aug 2023 18:45:00 GMT
// Connection: keep-alive
// Keep-Alive: timeout=5