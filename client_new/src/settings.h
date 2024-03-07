#include "pinSettings.cpp"

// WIFI
char *wifi_ssid = ("home");            // wifi ssid
char *wifi_password = ("0525611397");  // wifi password

// MQTT broker
const char brokerIp[] = ("10.0.0.12"); // mqtt broker ip
int brokerPort = 1883; // mqtt broker port
char *connectionCheckRequestTopic = ("checkConnectionRequest");
char *connectionCheckResponseTopic = ("checkConnectionResponse");


void deviceSetup() {
    
}