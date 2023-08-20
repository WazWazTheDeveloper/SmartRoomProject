import express = require('express');
import bodyParser from 'body-parser';
import { router } from './src/router';
import { WebSocketServerHandler } from './src/handlers/WebSocketServerHandler';
import { AppData } from './src/appData';
import { MqttClient } from './src/mqtt_client';
import { CheckConnection } from './src/scheduledFunctions/checkConnection';
import { AppdataEvent } from './src/interfaces/appData.interface';
import { DataPacket } from './src/classes/dataPacket';


const app: express.Application = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use('/', router);

async function startServer(): Promise<void> {
    await AppData.init()
    //@ts-ignore
    await MqttClient.initMqtt(process.env.MQTT_HOST, process.env?.MQTT_PORT, [])
    setup()
  
    startListeningToReqests()
  }
  
  async function setup(): Promise<void> {
    //get instances
    let appData = await AppData.getAppDataInstance();
    let client = MqttClient.getMqttClientInstance()
  
    //load subscribe list
    for (let index = 0; index < appData.getDeviceList().length; index++) {
        const device = appData.getDeviceList()[index];
        client.subscribe(device.getTopicPath(),appData.updateDevice)
    }
  
    //TODO: make this pretty
    appData.on(AppData.ON_DEVICE_ADDED, async (eventData:AppdataEvent) => {
      let client = MqttClient.getMqttClientInstance()
      let appData = await AppData.getAppDataInstance();
      client.subscribe(appData.getDeviceById(eventData.deviceUUID).getTopicPath(),appData.updateDevice)
    });

    appData.on(AppData.ON_DEVICE_REMOVED, async (eventData:AppdataEvent) => {
      let client = MqttClient.getMqttClientInstance()
      let appData = await AppData.getAppDataInstance();
      client.unsubscribe(eventData.oldTopic,appData.updateDevice)
    });

    appData.on(AppData.ON_DEVICE_TOPIC_CHANGE, async (eventData:AppdataEvent) => {
      let client = MqttClient.getMqttClientInstance()
      let appData = await AppData.getAppDataInstance();
      client.unsubscribe(eventData.oldTopic,appData.updateDevice)
      client.subscribe(appData.getDeviceById(eventData.deviceUUID).getTopicPath(),appData.updateDevice)
    });

    appData.on(AppData.ON_DATA_CHANGE, async (eventData:AppdataEvent) => {
      let client = MqttClient.getMqttClientInstance()
      let appData = await AppData.getAppDataInstance();
      let device = appData.getDeviceById(eventData.deviceUUID)
      let event = DataPacket.DATA_CHANGE;
      let massage: DataPacket = new DataPacket(DataPacket.SENDER_SERVER,eventData.deviceUUID,eventData.dataType,eventData.dataAt,event,device.getAsJsonForArduino(eventData.dataAt))
      client.sendMassage(device.getTopicPath(),massage);
    });
  
    // init scheduled functions
    await CheckConnection.init();
  }

function startListeningToReqests(): void {
    let server = app.listen(process.env.SERVER_PORT, () => {
      console.log(`listening on port ${process.env.SERVER_PORT}`)
    })
  
    WebSocketServerHandler.init();
    let wbserver = WebSocketServerHandler.getWebSocketServer()
    server.on('upgrade', (req, socket, head) => {
      wbserver.handleUpgrade(req, socket, head, (ws) => {
        if(req.url == "/appdata/websocket") {
          console.log("req.url")
          wbserver.emit('connection', ws, req)
        }
      })
    })
  }

startServer();
