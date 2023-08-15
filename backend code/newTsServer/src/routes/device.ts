import express, { Request, Response } from "express"
import { v4 as uuidv4 } from 'uuid';
import { Device } from "../classes/device";
import { AppData } from "../appData";
import { WebSocketServerHandler } from "../handlers/WebSocketServerHandler";



const router: express.Router = express.Router();

router.use((req: Request, res: Response, next) => {
    next()
});

// define the home page route
router.get('/getUUID', (req: Request, res: Response) => {
    var uuid = uuidv4()
    console.log(`new uuid generated ${uuidv4()}`)
    res.send(uuid)
})

router.post('/registerNewDevice', async (req: Request, res: Response) => {
    let deviceType = req.body.deviceType;
    let newUUID = uuidv4();
    let appdata = await AppData.getAppDataInstance();

    console.log(deviceType[0])
    // check if deviceType is array of numbers
    for (let index = 0; index < deviceType.length; index++) {
        const element = deviceType[index];
        if(isNaN(element)) {
            res.status(400);
            res.send();
            return;
        }
        
    }

    try{
        await appdata.createNewDevice("new device", newUUID, deviceType, `device/${newUUID}`);
        let newDevice: Device = appdata.getDeviceById(newUUID);
        res.status(200);
        WebSocketServerHandler.updateAppdata();
        res.send(newUUID);
    }catch(err) {
        res.status(400);
        res.send();
        return;
    }
})


router.get('/getData', async (req: Request, res: Response) => {
    let uuid = req.query.uuid;
    let appdata = await AppData.getAppDataInstance();
    console.log(req.query)
    let uuidString = String(uuid)

    res.setHeader("Content-Type", "application/json");

    // TODO: add try as deviceType can be somting non existent
    // try {
        let device: Device = appdata.getDeviceById(uuidString);
        res.status(200);
        res.json(device.getAsJsonForArduino(0));
        // console.log(device.getAsJsonForArduino(0))
    // }catch {
    //     res.status(400);
    // }



    res.send();

})

router.get('/getTopic', async (req: Request, res: Response) => {
    let uuid = req.query.uuid;
    let appdata = await AppData.getAppDataInstance();

    // TODO: change to convertor
    let uuidString = String(uuid)

    res.setHeader("Content-Type", "application/json");
    // TODO: add try as deviceType can be somting non existent
    let device: Device = appdata.getDeviceById(uuidString);
    let pubSubData = {
        topicPath: device.getTopicPath(),
    }

    res.status(200);
    res.json(pubSubData);
    res.send();
})

router.get('/test', async (req: Request, res: Response) => {
    let uuid = req.query.uuid;
    let appdata = await AppData.getAppDataInstance();

    // TODO: change to convertor
    let uuidString = "969041c7-3f80-4d28-b4d1-56fae78b802f"

    await appdata.getDeviceById(uuidString).setData(0, {
        "isOn": true,
        "temp": 21,
        "mode": 1,
        "speed": 0,
        "swing1": true,
        "swing2": false,
        "timer": 0,
        "isStrong": false,
        "isFeeling": false,
        "isSleep": false,
        "isScreen": true,
        "isHealth": false
    });

    res.setHeader("Content-Type", "application/json");
    // TODO: add try as deviceType can be somting non existen;

    res.status(200);
    res.send("pubSubData");
})

export { router as deviceRouter };
