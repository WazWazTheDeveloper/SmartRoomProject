#ifndef GLOBALVARIABLES_HPP
#define GLOBALVARIABLES_HPP

unsigned long lastRequestedUUIDMillis = 0;
unsigned long lastRequestedDataMillis = 0;
unsigned long lastMQTTConnectionAttemptMillis = 0;
bool isResetUUID = false;
unsigned long lastUUIDReset = 0;
bool hasData = false;

char uuid[37] = {'\0'};
char mqttTopic[108] = {'\0'};

#endif GLOBALVARIABLES_HPP
