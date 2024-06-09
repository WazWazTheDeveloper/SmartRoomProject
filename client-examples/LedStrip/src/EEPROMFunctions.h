#ifndef EEPROMFUNCTIONS_HPP
#define EEPROMFUNCTIONS_HPP
#include "Settings.h"
#include "globalVariables.h"
#include <EEPROM.h>
void readUUID();
void writeUUID();
void clearUUID();
boolean getUUID();

void readUUID()
{
    EEPROM.get(0, uuid);
    Serial.println("read UUID form eeprom");
    Serial.print("uuid: ");
    Serial.println(uuid);
    uuid[36] = '\0';
}

void writeUUID()
{
    EEPROM.put(0, uuid);
    EEPROM.end();
    Serial.println("wrote UUID to eeprom");
    Serial.print("uuid: ");
    Serial.println(uuid);
}

void clearUUID()
{
    for (int i = 0; i < 37; i++)
    {
        EEPROM.write(i, 0);
    }
    EEPROM.end();
    const char *empty = "";
    strcpy(uuid, empty);
    Serial.println("cleared eeprom");
}

boolean getUUID()
{
    readUUID();
    if (strlen(uuid) != 0)
    {
        return 1;
    }
    return 0;
}
#endif EEPROMFUNCTIONS_HPP