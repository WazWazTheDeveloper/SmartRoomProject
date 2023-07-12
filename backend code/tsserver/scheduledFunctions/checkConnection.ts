// import CronJob = require("node-cron");
// import mqttClient = require('../mqtt_client');
// import data = require('../utility/file_handler')
// import { GeneralData } from "../devies/typeClasses/generalData";
// import { Device } from "../devies/typeClasses/device";
// import { AirconditionerDevice } from "../devies/typeClasses/airconditionerDevice";
// import { device } from "../devies/types";

// const CHECK_INTERVAL = 5
// const IS_ALIVE_TOPIC = "isAlive";

// const scheduledJobFunction = CronJob.schedule(`*/${CHECK_INTERVAL} * * * * *`, () => {


//     new Promise<Array<Device<any>>>((resolve, reject) => {
//         let devices: Array<Device<any>> = [];
//         GeneralData.loadFromFile().then(generalData => {
//             for (let i = 0; i < generalData.deviceList.length; i++) {
//                 const device = generalData.deviceList[i];
//                 AirconditionerDevice.loadFromFile(device.UUID).then(acunit => {
//                     Device.loadFromFile<AirconditionerDevice>(device.UUID, acunit!).then(data => {
//                         devices.push(data)

//                         if (generalData.deviceList.length - 1 == i) {
//                             resolve(devices);
//                         }
//                     });
//                 });
//             }
//         })
//     }).then(devices => {
//         for (let i = 0; i < devices.length; i++) {
//             devices[i].checkConnection();
//             mqttClient.sendMessage(IS_ALIVE_TOPIC, String(Date.now()));
//         }
//         setInterval(() => {
//             for (let i = 0; i < devices.length; i++) {
//                 if (devices[i].isConnected) {
//                     console.log(`${devices[i].uuid} is alive`)
//                 }
//             }
//             // data.readFile("devices/01b68220-abdf-441b-9ae7-fefaf4ba9341").then(device => {
//             //     if (device.isAlive) {
//             //         console.log(`${device.uuid} is alive`)
//             //     }
//             // })
//         }, 5000);
//         console.log("Checking Connection to devices");
//     })




// });

// function initConnectionCheck() {
//     scheduledJobFunction.start();
// }

// export { initConnectionCheck }