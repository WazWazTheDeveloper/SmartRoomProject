import { ChangeStream } from "mongodb";
import { collections, connectToDatabase } from "./src/services/mongoDBService";
import { createDevice } from "./src/services/deviceService";
import { DeviceDataTypesConfigs } from "./src/interfaces/deviceData.interface";
function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

async function test() {
    await connectToDatabase()
    /** @ts-ignore */
    const games = (await collections.devices.find({}).toArray());
    console.log(games);

    let changeStream = collections.devices?.watch();
    // await delay(1000);
    // test();
    /** @ts-ignore */
    changeStream.on("change", (changeEvent) => {
    /** @ts-ignore */
        console.log(changeEvent.fullDocument)
    })

    let test:DeviceDataTypesConfigs = {
        dataID:0,
        typeID:0,
        iconName:"test",
        // dataTitle?:string,
        // isSensor?: boolean,
        // isOn?: boolean,
        // onName?:string,
        // ofName?:string,
    }
    // setInterval(() => {
        createDevice([test,test,test])
    // }, 1)
}

test();