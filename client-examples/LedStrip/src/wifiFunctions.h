#ifndef WIFIFUNCTIONS_HPP
#define WIFIFUNCTIONS_HPP

#include <ESP8266WiFi.h>
#include "Settings.h"
WiFiClient wifiClient;

void setupWifi()
{
    WiFi.mode(WIFI_STA);
    WiFi.begin(wifi_ssid, wifi_password);

    Serial.print("Connecting to WiFi ..");
    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.print(".");
    }
    Serial.println();
    Serial.print("Device ip:");
    Serial.println(WiFi.localIP());

    WiFi.setAutoReconnect(true);
    // WiFi.persistent(true);
}

#endif WIFIFUNCTIONS_HPP
