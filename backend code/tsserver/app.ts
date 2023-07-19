import express = require('express');
import { MqttClient, SubType } from './mqtt_client';
import { AppData } from './AppData';
import { router } from './router';
import { Task } from './tasks';
import { DataPacket } from './classes/DataPacket';
import { TopicData } from './classes/topicData';
import { log } from 'console';
import { initConnectionCheck } from './scheduledFunctions/checkConnection';
import { Device } from './classes/device';
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
  initConnectionCheck()

  // let uuid = uuidv4();
  // appData.removeDevice("74b160ae-d22a-4234-81f0-97a49c6d5873")
  // await appData.addDevice(uuid,uuid,[Device.AIRCONDITIONER_TYPE]);
  // appData.getDeviceById(uuid).addListenTopic(appData.getGeneralData().getTopicByName(uuid),"a",true,"3",{functionType : ""})
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
