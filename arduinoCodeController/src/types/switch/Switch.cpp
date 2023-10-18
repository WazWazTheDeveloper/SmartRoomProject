#include "Switch.h"
#include <ArduinoJson.h>

Switch::Switch() {
    isOn = false;
}

void Switch::setIsOn(bool newIsOn) {
    isOn = newIsOn;
}

bool Switch::getIsOn() {
    return isOn;
}