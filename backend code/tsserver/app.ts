import express = require('express');
import {MqttClient, SubType} from './mqtt_client';
import { initAllScheduledFunctions } from './scheduledFunctions';

const port: number = 3000;
const app: express.Application = express();

//routes
import {router} from './router';
import {AppData} from './AppData';
import { GeneralData, TopicData } from './devies/typeClasses/generalData';
import { log } from 'console';
app.use('/', router)

// TODO: on load add all SubTypes to mqtt client

// DEL:here only for testing
const HOST = '10.0.0.12';
const PORT = '1883';

AppData.getAppDataInstance().then(data => {
  // WARN: will crash if not given uniqe UUID each time
  // data.addNewDevice("123112311","test",["airconditioner"])
  // console.log(data.getGeneralData().topicList)
  x(data.getGeneralData(),data);
})

async function x(generalData:GeneralData,data:AppData){
  let y = []
  // TODO: add this incliding the bind (very impotent as the object isnt the one calling the function)
  let p = new SubType(generalData.topicList[0],data.getDeviceList()[0].onUpdateData.bind(data.getDeviceList()[0]))
  y.push(p)
  await MqttClient.initMqtt(HOST,PORT,[])
  MqttClient.getMqttClientInstance().subscribe(p,0);
}

function v(topic: string, message: string,topicData: TopicData) {
  console.log(topicData);
}
 

// IMPLEMENT: schduled Functions
// schduled Functions
// initAllScheduledFunctions() 
 
// Server setup
app.listen(port, () => {
  console.log(`listening on port ${port}`)
})
