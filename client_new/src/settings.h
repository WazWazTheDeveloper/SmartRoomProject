#include "pinSettings.cpp"
#include "dataObject.h"

// Devic
char *deviceName = ("test"); // wifi ssid
char *deviceTargetID = "0000"; //has to be uniqe

// WIFI
char *wifi_ssid = ("home");            // wifi ssid
char *wifi_password = ("0525611397");  // wifi password

// MQTT broker
const char brokerIp[] = ("10.0.0.12"); // mqtt broker ip
int brokerPort = 1883; // mqtt broker port
char *connectionCheckRequestTopic = ("checkConnectionRequest");
char *connectionCheckResponseTopic = ("checkConnectionResponse");
char *initDeviceTopic = ("initDevice");
unsigned long requestDelay = 5000; //init device delay between requests

const int deviceType[] = {0,1,2}; // device types array

// Dont touch this
const int deviceTypeCount = sizeof(deviceType) / sizeof(deviceType[0]);
DataObject *deviecDataArr[3];

void deviceSetup() {
    
}