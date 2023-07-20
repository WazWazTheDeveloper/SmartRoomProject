import express = require('express');
import { MqttClient, SubType } from './mqtt_client';
import { AppData } from './AppData';
import { router } from './router';
const bodyParser = require('body-parser');
import { CheckConnection } from './scheduledFunctions/checkConnection';
require('dotenv').config()

const app: express.Application = express();
app.use('/', router)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

async function startServer(): Promise<void> {
  await AppData.init()
  //@ts-ignore
  await MqttClient.initMqtt(process.env.MQTT_HOST, process.env?.MQTT_PORT, [])
  setup()

  startListeningToReqests()
}

import { v4 as uuidv4 } from 'uuid';

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
  app.listen(process.env.SERVER_PORT, () => {
    console.log(`listening on port ${process.env.SERVER_PORT}`)
  })
}

startServer();
