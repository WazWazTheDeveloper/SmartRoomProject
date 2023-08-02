// #include "AcRemote.h"
#include "WiFiEsp.h"
#include <ArduinoJson.h>

// #ifndef HAVE_HWSERIAL1
// #include "SoftwareSerial.h"
// SoftwareSerial Serial1(14, 15); // RX, TX
// #endif
#include "SoftwareSerial.h"
SoftwareSerial ESPSERIAL(14, 15); // RX, TX

#include <ArduinoMqttClient.h>
#define BUTTON_PIN 9

char *wifi_ssid = "home";
char *wifi_password = "0525611397";

const char broker[] = "10.0.0.12";
int port = 1883;

const char topic[] = "test";

char *mqtt_publish_topic = "/test1";
char *mqtt_subscribe_topic = "/test";

WiFiEspClient espClient;
MqttClient mqttClient(espClient);

void setup_wifi()
{
    pinMode(BUTTON_PIN, INPUT_PULLUP);
    // initialize serial for ESP module
    ESPSERIAL.begin(9600);
    // initialize ESP module
    WiFi.init(&ESPSERIAL);

    delay(10);
    // We start by connecting to a WiFi network
    Serial.println();
    Serial.print("Connecting to ");
    Serial.println(wifi_ssid);

    WiFi.begin(wifi_ssid, wifi_password);

    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.print(".");
    }

    Serial.println("");
    Serial.println("WiFi connected");
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());
}

void onMqttMessage(int messageSize)
{
    String s = "";
    // we received a message, print out the topic and contents
    Serial.println("Received a message with topic '");
    Serial.print(mqttClient.messageTopic());
    Serial.print("', length ");
    Serial.print(messageSize);
    Serial.println(" bytes:");

    // use the Stream interface to print the contents
    while (mqttClient.available())
    {
        s.concat((char)mqttClient.read());
    }
    Serial.println();
    Serial.println(s);

    StaticJsonDocument<500> doc;
    DeserializationError error = deserializeJson(doc, s);

    // Test if parsing succeeds.
    if (error)
    {
        Serial.print(F("deserializeJson() failed: "));
        Serial.println(error.f_str());
        return;
    }
    int l = doc["temp"];
    Serial.println(l);
}

void setup()
{
    Serial.begin(115200);
    setup_wifi();

    if (!mqttClient.connect(broker, port))
    {
        Serial.print("MQTT connection failed! Error code = ");
        Serial.println(mqttClient.connectError());

        while (1)
            ;
    }
    mqttClient.onMessage(onMqttMessage);
    Serial.println("You're connected to the MQTT broker!");
    Serial.println();

    Serial.print("Subscribing to topic: ");
    Serial.println(topic);
    Serial.println();

    // subscribe to a topic
    mqttClient.subscribe(topic);

    // topics can be unsubscribed using:
    // mqttClient.unsubscribe(topic);

    Serial.print("Waiting for messages on topic: ");
    Serial.println(topic);
    Serial.println();
}

void loop()
{
    mqttClient.poll();
}