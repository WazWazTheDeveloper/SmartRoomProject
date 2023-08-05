import express = require('express');
import { MqttClient, SubType } from './src/mqtt_client';
import { AppData } from './src/AppData';
import { router } from './src/router';
import bodyParser from 'body-parser';
import { CheckConnection } from './src/scheduledFunctions/checkConnection';
import Websocket, { WebSocketServer } from 'ws';
import { WebSocketServerHandler } from './src/WebSocketServerHandler';
require('dotenv').config()


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
  client.setNewSubscribeList(appData.getSubTypeList());

  //add listener to update subscribe list automatically
  appData.on(AppData.ON_DEVICE_TOPIC_CHANGE, updateMqttClientSubList);

  // init scheduled functions
  // await CheckConnection.init()
}

async function updateMqttClientSubList(callback: Function) {
  let client = MqttClient.getMqttClientInstance()
  let appData = await AppData.getAppDataInstance()

  client.setNewSubscribeList(appData.getSubTypeList())
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
