import express = require('express');
const cookieParser = require('cookie-parser')
import bodyParser = require('body-parser');
import { logger } from './src/middleware/logger';


import { DeviceDataTypesConfigs } from "./src/interfaces/deviceData.interface";
import { deviceDBHandler } from "./src/handlers/deviceDBHandler";
import { taskCheckHandler } from "./src/handlers/taskHandler";
import { connectToDatabase } from "./src/services/mongoDBService";
import { initializeDeviceHandler } from "./src/services/deviceService";
import { initializeTasksFromDB, updateTaskProperty } from "./src/services/taskService";
import { router } from './src/routes/v1/router';

const app = express();
app.use(logger)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser())

app.use('/api/v1', router);

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function test() {
    await connectToDatabase()
    await initializeDeviceHandler(deviceDBHandler);
    /** @ts-ignore */
    // const games = (await collections.devices.find({}).toArray());
    // console.log(games);

    let changeStream = collections.devices?.watch();
    // await delay(1000);
    // test();
    /** @ts-ignore */
    let x = changeStream.on("change", (changeEvent) => {
        /** @ts-ignore */
        // console.log(changeEvent.fullDocument)
        if (changeEvent.operationType = "update") {
            //@ts-ignore
            // console.log(changeEvent.updateDescription)
        }
    })

    x.close()

    let test: DeviceDataTypesConfigs = {
        dataID: 0,
        typeID: 0,
        iconName: "test",
        // dataTitle?:string,
        // isSensor?: boolean,
        // isOn?: boolean,
        // onName?:string,
        // ofName?:string,
    }

    // createTask("test")
    // createTask("test2")
    // updateTaskProperty("837095cd-4286-424f-86ab-736634d38892" , [{
    //     taskPropertyName: "propertyCheck",
    //     operation : "add",
    //     checkType : 1,
    //     dataID: 1,
    //     deviceID: "1",
    //     propertyName:"a",
    //     valueToCompare:"sa"
    // }])

    // updateTaskProperty("837095cd-4286-424f-86ab-736634d38892" , [{
    //     taskPropertyName: "todoTasks",
    //     operation : "add",
    //     dataID:1,
    //     deviceID:"asdasd",
    //     newValue:"asdasdasd",
    //     propertyName:"asdasdasd"
    // }])
    // updateTaskProperty("9ac592ad-825a-4ec2-a7cf-8385298c432b" , [{
    //     taskPropertyName: "timeChecks",
    //     operation : "add",
    //     timingData: "1 2 * * *",
    // }])
    //     updateTaskProperty("9ac592ad-825a-4ec2-a7cf-8385298c432b" , [{
    //     taskPropertyName: "timeChecks",
    //     operation : "add",
    //     timingData: "1 * * * *",
    // }])
    // updateTaskProperty("24b1fd36-5894-438f-8f16-7116598577ef" , [{
    //     taskPropertyName: "timeChecks",
    //     operation : "add",
    //     timingData: "1 2 * * *",
    // }])
    // updateTaskProperty("9ac592ad-825a-4ec2-a7cf-8385298c432b" , [{
    //     taskPropertyName: "propertyChecks",
    //     operation : "delete",
    //     itemID: "5992839e-4083-4193-9a0a-77163c47b56f"
    // }])
    // setInterval(async () => {
    // createDevice("test",[test,test,test])
    // let x = await getDocuments<TDeviceJSON_DB>(COLLECTION_DEVICES,{ _id: "11aca6a5-60ee-4636-8b48-a35153d4c34c" })
    // console.log(x)
    // await updateDeviceProperties('11aca6a5-60ee-4636-8b48-a35153d4c34c', [{
    //     propertyName : `deviceName`,
    //     newValue : `test2122  ${Math.random()}`
    // },{
    //     propertyName : "isAccepted",
    //     newValue : 1
    // }])
    // }, 5000)

    // getDevice('712ff6ad-d4a6-4b92-97b4-b747f6e45fa1')
    // console.log(isCronValid("*/1 * * * * *"))
    // addScheduledTask('*/1 * * * * *',"test2",() => {console.log("test2")})
    // addScheduledTask('*/1 * * * * *',"test",() => {console.log("test")})
    // await delay(5000);
    // stopScheduledTask("test")
    initializeTasksFromDB(taskCheckHandler);
}

// test();

async function startServer(): Promise<void> {
    await connectToDatabase()
    await initializeDeviceHandler(deviceDBHandler);
    await initializeTasksFromDB(taskCheckHandler);
    startListeningToReqests()
}

function startListeningToReqests(): void {
    let server = app.listen(process.env.SERVER_PORT, () => {
        // TODO: logger this:
        console.log(`listening on port ${process.env.SERVER_PORT}`)
    })

}

startServer();