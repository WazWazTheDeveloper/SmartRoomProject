#include "AcRemote.h"
#include "WiFiEsp.h"
#include <ArduinoMqttClient.h>

#include "SoftwareSerial.h"
SoftwareSerial EspSerial(14, 15); // RX, TX

AcRemote acRemote = AcRemote();

char ssid[] = "home";        // your network SSID (name)
char pass[] = "0525611397";  // your network password
int status = WL_IDLE_STATUS; // the Wifi radio's status

WiFiEspClient wifiClient;
MqttClient mqttClient(wifiClient);

const char broker[] = "10.0.0.12";
int port = 1883;
const char topic[] = "house/room/ac";

const long interval = 1000;
unsigned long previousMillis = 0;

int count = 0;

void setup()
{
    // initialize serial for debugging
    Serial.begin(115200);
    // initialize serial for ESP module
    EspSerial.begin(9600);
    // initialize ESP module
    WiFi.init(&EspSerial);

    // check for the presence of the shield
    if (WiFi.status() == WL_NO_SHIELD)
    {
        Serial.println("WiFi shield not present");
        // don't continue
        while (true)
            ;
    }

    // attempt to connect to WiFi network
    while (status != WL_CONNECTED)
    {
        Serial.print("Attempting to connect to WPA SSID: ");
        Serial.println(ssid);
        // Connect to WPA/WPA2 network
        status = WiFi.begin(ssid, pass);
    }

    // you're connected now, so print out the data
    Serial.println("You're connected to the network");

    Serial.print("Attempting to connect to the MQTT broker: ");
    Serial.println(broker);

    if (!mqttClient.connect(broker, port))
    {
        Serial.print("MQTT connection failed! Error code = ");
        Serial.println(mqttClient.connectError());

        while (1)
            ;
    }

    Serial.println("You're connected to the MQTT broker!");
    Serial.println();

    mqttClient.subscribe(topic);
}

void loop() {
  int messageSize = mqttClient.parseMessage();
  if (messageSize) {
    // we received a message, print out the topic and contents
    Serial.print("Received a message with topic '");
    Serial.print(mqttClient.messageTopic());
    Serial.print("', length ");
    Serial.print(messageSize);
    Serial.println(" bytes:");

    // use the Stream interface to print the contents
    while (mqttClient.available()) {
      Serial.print((char)mqttClient.read());
    }
    Serial.println();

    Serial.println();
  }
}