import express = require('express');
import { MqttClient } from './mqtt_client';
import { initAllScheduledFunctions } from './scheduledFunctions';
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
  // let y = []
  let x = data.getGeneralData().topicList[1];
  // await data.addListenToTopicToDevice("01b68220-abdf-441b-9ae7-fefaf4ba9342", x, "airconditioner", "data0", { "functionType": "default" })
  setInterval(async () => {
    // data.getDeviceList()[0].setVar(0,"isOn",true)
    // data.getDeviceList()[0].setVar(0,"isOn" ,true)
    // await data.removeDevice("test23")
    // await  data.removeListenToTopicToDevice("01b68220-abdf-441b-9ae7-fefaf4ba9342",x,"test","test",{"functionType":"default"})
  }, 1000)
  // data.re("01b68220-abdf-441b-9ae7-fefaf4ba9342",x,"test","test",{"functionType":"default"}))
  // let topic = data.getDeviceList()[0].listenTo[0]
  // log(topic)
  // let p = new SubType(topic,data.getDeviceList()[0].onUpdateData.bind(data.getDeviceList()[0]))
  // let p2 = new SubType(topic,data.getDeviceList()[0].onUpdateData.bind(data.getDeviceList()[0]))
  // y.push(p)
  // y.push(p2)
  // MqttClient.getMqttClientInstance().subscribe(p,0);
  // MqttClient.getMqttClientInstance().subscribe(p2,0);
  // MqttClient.getMqttClientInstance().emptySubscribeList();
}

function startListeningToReqests(): void {
  app.listen(process.env.SERVER_PORT, () => {
    console.log(`listening on port ${process.env.SERVER_PORT}`)
  })
}

startServer();
