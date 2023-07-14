import express = require('express');
import { MqttClient, SubType } from './mqtt_client';
import { initAllScheduledFunctions } from './scheduledFunctions';

const port: number = 3000;
const app: express.Application = express();

//routes
import { router } from './router';
import { AppData } from './AppData';
import { GeneralData } from './devies/typeClasses/generalData';
import { Device, TopicData } from './devies/typeClasses/device';
import { log } from 'console';
app.use('/', router)


// TODO: on load add all SubTypes to mqtt client

// DEL:here only for testing
const HOST = '10.0.0.12';
const PORT = '1883';

async function updateMqttClientSubList(p:any) {
  let client =MqttClient.getMqttClientInstance()
  let appData = await AppData.getAppDataInstance()
  client.setNewSubscribeList(appData.getSubTypeList())
}

async function setup() {
  let appData = await AppData.getAppDataInstance();
  let client = MqttClient.getMqttClientInstance()
  client.setNewSubscribeList(appData.getSubTypeList());
  appData.addOnDeviceTopicChangeListener(updateMqttClientSubList)
}

AppData.getAppDataInstance().then(async (data) => {
  // WARN: will crash if not given uniqe UUID each time
  // data.addNewDevice("123112311","test",["airconditioner"])
  // console.log(data.getGeneralData().topicList)
  // data.removeDevice("01b68220-abdf-441b-9ae7-fefaf4ba9342")
  // log(data.getGeneralData().topicList)
  // data.removeGeneralTopic("test");
  // data.addGeneralTopic("test","test");
  // console.log(data.getDeviceList());
  // let x =MqttClient.getMqttClientInstance()
  // x.setNewSubscribeList(data.getSubTypeList());
  // data.addOnDeviceTopicChangeListener(updateMqttClientSubList)
  xx(data.getGeneralData(),data);
})

async function xx(generalData: GeneralData, data: AppData) {
  // let y = []
  // let x = data.getGeneralData().topicList[1];
  setInterval(async () => {
    // await data.addPublishToTopicToDevice("01b68220-abdf-441b-9ae7-fefaf4ba9342", x, "airconditioner", "data0", { "functionType": "default" })
    // await data.removeDevice("test23")
    // await  data.removeListenToTopicToDevice("01b68220-abdf-441b-9ae7-fefaf4ba9342",x,"test","test",{"functionType":"default"})
  }, 1000)
  // data.re("01b68220-abdf-441b-9ae7-fefaf4ba9342",x,"test","test",{"functionType":"default"})
  // TODO: add this incliding the bind (very impotent as the object isnt the one calling the function)
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


// IMPLEMENT: schduled Functions
// schduled Functions
// initAllScheduledFunctions() 

// Server setup
MqttClient.initMqtt(HOST, PORT, [])
app.listen(port, () => {
  setup();
  console.log(`listening on port ${port}`)
})
