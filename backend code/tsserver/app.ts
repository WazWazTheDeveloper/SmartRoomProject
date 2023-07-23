import express = require('express');
import { MqttClient, SubType } from './src/mqtt_client';
import { AppData } from './src/AppData';
import { router } from './src/router';
import bodyParser from 'body-parser';
import { CheckConnection } from './src/scheduledFunctions/checkConnection';
import Websocket, { WebSocketServer } from 'ws';
require('dotenv').config()


const app: express.Application = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use('/', router);

const wsServer = new WebSocketServer({ noServer: true });

// TODO: fix this
wsServer.on('connection', async (socket) => {
  let appData = await AppData.getAppDataInstance();
  socket.send(JSON.stringify(appData.getDeviceList()))
  console.log("connected")
  socket.on('message', message => console.log(message));
});

// TODO make this like some sort of class
app.get('/', async (req, res) => {
  wsServer.clients.forEach(async (client) => {
    // Check that connect are open and still alive to avoid socket error
    if (client.readyState === Websocket.OPEN) {
      let appData = await AppData.getAppDataInstance();
      client.send(JSON.stringify(appData.getDeviceList()));
    }
  });
})



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
  await CheckConnection.init()
}

async function updateMqttClientSubList(callback: Function) {
  let client = MqttClient.getMqttClientInstance()
  let appData = await AppData.getAppDataInstance()

  client.setNewSubscribeList(appData.getSubTypeList())
}

function startListeningToReqests(): void {
  let x = app.listen(process.env.SERVER_PORT, () => {
    console.log(`listening on port ${process.env.SERVER_PORT}`)
  })

  x.on('upgrade', (req, socket, head) => {
    // TODO: add path check
    wsServer.handleUpgrade(req, socket, head, (ws) => {
      wsServer.emit('connection', ws, req)
    })
  })
}

startServer();
