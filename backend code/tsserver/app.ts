import express = require('express');
import { MqttClient } from './mqtt_client';
import { AppData } from './AppData';
import { router } from './router';
require('dotenv').config()

const app: express.Application = express();
app.use('/', router)

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
  
  // IMPLEMENT: schduled Functions
  // schduled Functions like check connection


  // DEL: this is here for testing
  xx(appData);
}

async function updateMqttClientSubList(callback: Function) {
  let client = MqttClient.getMqttClientInstance()
  let appData = await AppData.getAppDataInstance()

  client.setNewSubscribeList(appData.getSubTypeList())
}

async function xx(data: AppData) {
  let x = data.getGeneralData()

}

function startListeningToReqests(): void {
  app.listen(process.env.SERVER_PORT, () => {
    console.log(`listening on port ${process.env.SERVER_PORT}`)
  })
}

startServer();
