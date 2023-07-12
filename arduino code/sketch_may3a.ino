
/*
 * ReceiveDump.cpp
 *
 * Dumps the received signal in different flavors.
 * Since the printing takes so much time (200 ms @115200 for NEC protocol, 70ms for NEC repeat),
 * repeat signals may be skipped or interpreted as UNKNOWN.
 *
 *  This file is part of Arduino-IRremote https://github.com/Arduino-IRremote/Arduino-IRremote.
 *
 ************************************************************************************
 * MIT License
 *
 * Copyright (c) 2020-2022 Armin Joachimsmeyer
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is furnished
 * to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
 * OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 ************************************************************************************
 */
#include <Arduino.h>

#include "PinDefinitionsAndMore.h" // Define macros for input and output pin etc.

#if !defined(RAW_BUFFER_LENGTH)
#  if RAMEND <= 0x4FF || RAMSIZE < 0x4FF
#define RAW_BUFFER_LENGTH  180  // 750 (600 if we have only 2k RAM) is the value for air condition remotes. Default is 112 if DECODE_MAGIQUEST is enabled, otherwise 100.
#  elif RAMEND <= 0x8FF || RAMSIZE < 0x8FF
#define RAW_BUFFER_LENGTH  600  // 750 (600 if we have only 2k RAM) is the value for air condition remotes. Default is 112 if DECODE_MAGIQUEST is enabled, otherwise 100.
#  else
#define RAW_BUFFER_LENGTH  750  // 750 (600 if we have only 2k RAM) is the value for air condition remotes. Default is 112 if DECODE_MAGIQUEST is enabled, otherwise 100.
#  endif
#endif

/*
 * MARK_EXCESS_MICROS is subtracted from all marks and added to all spaces before decoding,
 * to compensate for the signal forming of different IR receiver modules. See also IRremote.hpp line 142.
 *
 * You can change this value accordingly to the receiver module you use.
 * The required value can be derived from the timings printed here.
 * Keep in mind that the timings may change with the distance
 * between sender and receiver as well as with the ambient light intensity.
 */
#define MARK_EXCESS_MICROS    20    // Adapt it to your IR receiver module. 20 is recommended for the cheap VS1838 modules.

//#define RECORD_GAP_MICROS 12000 // Default is 5000. Activate it for some LG air conditioner protocols
//#define DEBUG // Activate this for lots of lovely debug output from the decoders.
#define IR_SEND_PIN 8
#include <IRremote.hpp>

//+=============================================================================
// Configure the Arduino
//
void setup() {
    pinMode(5, INPUT_PULLUP);
    // pinMode(LED_BUILTIN, OUTPUT);
    Serial.begin(115200);   // Status message will be sent to PC at 9600 baud
    // IrReceiver.begin(7, ENABLE_LED_FEEDBACK);
    IrSender.begin(); // Start with IR_SEND_PIN as send pin and enable feedback LED at default feedback LED pin
}

//+=============================================================================
// The repeating section of the code
//
void loop() {
    if(digitalRead(5) == LOW) {
    Serial.println("send");
          uint16_t rawData[211] = {8930, 4570, 480, 1770, 480, 1770, 480, 620, 480, 620, 480, 620, 480, 620, 480, 1770, 480, 1770, 480, 620, 480, 620, 480, 620, 480, 620, 480, 620, 480, 620, 480, 620, 480, 1770, 480, 620, 480, 620, 480, 620, 480, 620, 480, 620, 480, 1770, 480, 1770, 480, 1770, 480, 620, 480, 620, 480, 620, 480, 620, 480, 620, 480, 620, 480, 620, 480, 620, 480, 620, 480, 620, 480, 620, 480, 620, 480, 620, 480, 1770, 480, 620, 480, 620, 480, 620, 480, 620, 480, 620, 480, 620, 480, 620, 480, 620, 480, 1770, 480, 620, 480, 620, 480, 620, 480, 620, 480, 620, 480, 620, 480, 1770, 480, 620, 480, 620, 480, 620, 480, 620, 480, 620, 480, 620, 480, 620, 480, 620, 480, 620, 480, 620, 480, 620, 480, 620, 480, 620, 480, 620, 480, 620, 480, 620, 480, 620, 480, 620, 480, 620, 480, 620, 480, 620, 480, 620, 480, 620, 480, 1770, 480, 620, 480, 620, 480, 620, 480, 620, 480, 620, 480, 620, 480, 620, 480, 620, 480, 620, 480, 620, 480, 620, 480, 620, 480, 620, 480, 620, 480, 620, 480, 620, 480, 620, 480, 620, 480, 1770, 480, 1770, 480, 620, 480, 620, 480, 620, 480, 620, 480, 1770, 480, 1770, 480};
          IrSender.sendRaw(rawData, sizeof(rawData) / sizeof(rawData[0]), NEC_KHZ); // Note the approach used to automatically calculate the size of the array.
          // delay(1000);
  }
    // if (IrReceiver.decode()) {  // Grab an IR code
    //     IrReceiver.compensateAndPrintIRResultAsCArray(&Serial, true); // Output the results as uint16_t source code array of micros
    //     // IrReceiver.printIRResultAsCVariables(&Serial);
    //     // IrReceiver.printIRSendUsage(&Serial);
    //     IrReceiver.resume();                            // Prepare for the next value
    // }
}