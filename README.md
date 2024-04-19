# Smaret Room Project

This project showcases my attempt at creating a smarthome hub and DIY smart devices

The goal that were achived in the project:

-   Ability to control various device types with different types of controls from a web UI
-   Giving different user ability to control different devices based on permissions

## Running the hub and the web UI

Clone the project

```
$ git clone https://github.com/WazWazTheDeveloper/SmartRoomProject
```

**Using docker**

> this will only work on windows machine as the paths in compose.yaml are not formated correctly for linux

open `compose.yaml` and enter your local ip in the 27th line

```
27: - BACKEND_URL=ENTER YOUR IP HERE
```

then run

```
$ docker compose up
```

and you will be able to see the web UI at `http://localhost:3000/`

<!-- **From sources** -->

## Device example

open the `client-examples/LedStrip/` folder with platform.io

open `src/settings.h` and set the following:

-   `wifi_ssid` - your wifi network name
-   `wifi_password` - your wifi network name
-   `broker` - your mqtt broker ip(if you are running it locally on your pc enter your local ip address)
-   `serverip` - your hub ip(if you are running it locally on your pc enter your local ip address)

assemble the esp according to the schematics:

![Imale](./old/client-examples/LedStrip/LedStrip_Example_Wiring.png)

and upload the firmware to the esp

## Quickstart

open the web UI: `http://localhost:3000/login`

enter `admin` in the username and password field

then click on the settings icon

![SettingsIcon](/old/client-examples/LedStrip/settings%20icons.png)

and then on the `devices` tab

you should be able to see a device named `LedStripExpamle` and have the ability accept, deny and delete it

once you accpet the device you will be able to see and interact with it in main tab(the first icon in the sidebar)

<!-- ## Creating a device -->

## Project Structure

**Root folder**

Folders:

-   `controller` - The central component of the hub responsible for processing all logical operations.
-   `frontend` - The web ui server
-   `esp8266-client` - Codebase for ESP devices.
-   `authService` - Service responsible for managing user authentication.
-   `accountService` - Service for Managing user accounts and permissions.
-   `mongo` - Contains configuration code for database
-   `proxy` - Contains configuration code for reverence proxy

Files:

-   `README.md`
-   `.gitignore`
-   `compose.yaml` - Docker configuration file for setting up the development environment.
-   `LICENSE` - MIT License, i.e. you are free to do whatever is needed with the given code with no limits.

Client folder structure:

```
esp8266_client/Src
|   dataObject.cpp
|   dataObject.h
|   EEPROMFunctions.h
|   globalVariables.h
|   main.cpp
|   mqttFunctions.h
|   pinSettings.cpp
|   settings.h
|   wifiFunctions.h
|
\---dataTypes
        multiStateButtonData.cpp
        numberData.cpp
        switchData.cpp
        multiStateButtonData.h
        numberData.h
        switchData.h
```

-   pinSettings - Configuration for pins that are used for controlling different appliances
-   settings - Configuration for internal logic, server IPs, and additional device settings.

## Dependencies

**Backend:**

-   [Node](https://nodejs.org) - Runtime environment
-   [MongoDB](https://www.mongodb.com/) - Database
-   [Express](https://expressjs.com/) - Backend framework
-   [Mqtt](https://github.com/mqttjs/MQTT.js) - Communication protocol used to Communicate with the devices
-   [JWT](https://github.com/auth0/node-jsonwebtoken) - Creating and authenticating session tokens
-   [Node-cron](https://github.com/node-cron/node-cron) - Scheduling tasks and automating recurring processes within the application.
-   [Winston](https://github.com/winstonjs/winston) - Logging

**Frontend:**

-   [React](https://react.dev/) - Frontend frameword
-   [Next.js](https://nextjs.org/) - React framework

**Clients:**

-   [Arduino core for ESP8266](https://github.com/esp8266/Arduino) - Framework for the esp8266
-   [ArduinoJson](https://arduinojson.org/) - Used to read and create jsons to communicate with the server via the mqtt protocol
-   [ArduinoMqttClient](https://github.com/arduino-libraries/ArduinoMqttClient) - Used to communicate with the server
-   [FastLED](https://fastled.io/) - Used to control led strips
-   [IRremoteESP8266](https://github.com/crankyoldgit/IRremoteESP8266) - Used to control everything connected to IR leds
