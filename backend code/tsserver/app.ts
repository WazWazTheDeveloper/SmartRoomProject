import express = require('express');
import { MqttClient } from './mqtt_client';
import { initAllScheduledFunctions } from './scheduledFunctions';
import { AppData } from './AppData';
import { router } from './router';
import { Task, VarCheck } from './tasks';
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
  // TODO: do the same thing for tasks
  // IMPLEMENT: schduled Functions
  // schduled Functions
  // initAllScheduledFunctions() 

  


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

  // let task = data.getTaskList()[0].addVarCheck("01b68220-abdf-441b-9ae7-fefaf4ba9342","temp",0,VarCheck.CHECK_EQUAL_TO,24);
  // let task = data.getTaskList()[0].addTodoTask("01b68220-abdf-441b-9ae7-fefaf4ba9342",1,"temp",20)
  // console.log(data.getTaskList()[0]);
  data.getTaskList()[0].onUpdateData()

  setInterval(async () => {

  }, 1000)
}

function startListeningToReqests(): void {
  app.listen(process.env.SERVER_PORT, () => {
    console.log(`listening on port ${process.env.SERVER_PORT}`)
  })
}

startServer();
