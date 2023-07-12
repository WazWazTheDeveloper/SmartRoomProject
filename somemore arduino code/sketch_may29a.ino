
// #include "AcRemote.h"
// #include "WiFiEsp.h"

// AcRemote acRemote = AcRemote();

// #include "SoftwareSerial.h"
// SoftwareSerial EspSerial(14, 15); // RX, TX

// char ssid[] = "home";        // your network SSID (name)
// char pass[] = "0525611397";  // your network password
// int status = WL_IDLE_STATUS; // the Wifi radio's status

// char server[] = "arduino.cc";

// // Initialize the Ethernet client object
// WiFiEspClient client;

// void sendCommand()
// {
// }

// void setup()
// {
//   // acRemote.begin();
//   // acRemote.execute();
//   // delay(2000);
//   // acRemote.setIsOn(true).execute();
//   // EspSerial.begin(9600);  // ESP-01 module operates at 115200 baud rate
//   // delay(1000);
//   // EspSerial.println("AT+UART_DEF=115200,8,1,0,0");
//   // Serial.begin(115200);     // while the Serial Monitor uses 9600 baud rate

//   // initialize serial for debugging
//   Serial.begin(115200);
//   // initialize serial for ESP module
//   EspSerial.begin(9600);
//   // initialize ESP module
//   WiFi.init(&EspSerial);

//   // check for the presence of the shield
//   if (WiFi.status() == WL_NO_SHIELD)
//   {
//     Serial.println("WiFi shield not present");
//     // don't continue
//     while (true)
//       ;
//   }

//   // attempt to connect to WiFi network
//   while (status != WL_CONNECTED)
//   {
//     Serial.print("Attempting to connect to WPA SSID: ");
//     Serial.println(ssid);
//     // Connect to WPA/WPA2 network
//     status = WiFi.begin(ssid, pass);
//   }

//   // you're connected now, so print out the data
//   Serial.println("You're connected to the network");

//   printWifiStatus();

//   Serial.println();
//   Serial.println("Starting connection to server...");
//   // if you get a connection, report back via serial
//   if (client.connect(server, 80))
//   {
//     Serial.println("Connected to server");
//     // Make a HTTP request
//     client.println("GET /asciilogo.txt HTTP/1.1");
//     client.println("Host: arduino.cc");
//     client.println("Connection: close");
//     client.println();
//   }
// }
// void loop()
// {
//   // acRemote.init();
//   // put your main code here, to run repeatedly:
//   // while (EspSerial.available() > 0) // While the data output is available on the EspSerial interface(the ESP-01 module)
//   //   Serial.write(EspSerial.read()); // Write it into the Serial Monitor
//   // while (Serial.available() > 0)    // while the data is available input is available in the Serial Interface
//   //   EspSerial.write(Serial.read()); // Send it to the ESP-01 Module

//   // Serial.println("a") ;

//   // if there are incoming bytes available
//   // from the server, read them and print them
//   while (client.available())
//   {
//     char c = client.read();
//     Serial.write(c);
//   }

//   // if the server's disconnected, stop the client
//   if (!client.connected())
//   {
//     Serial.println();
//     Serial.println("Disconnecting from server...");
//     client.stop();

//     // do nothing forevermore
//     while (true)
//       ;
//   }
// }

// void printWifiStatus()
// {
//   // print the SSID of the network you're attached to
//   Serial.print("SSID: ");
//   Serial.println(WiFi.SSID());

//   // print your WiFi shield's IP address
//   IPAddress ip = WiFi.localIP();
//   Serial.print("IP Address: ");
//   Serial.println(ip);

//   // print the received signal strength
//   long rssi = WiFi.RSSI();
//   Serial.print("Signal strength (RSSI):");
//   Serial.print(rssi);
//   Serial.println(" dBm");
// }