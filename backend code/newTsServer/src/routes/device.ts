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

// TODO: add a querry to select device type
router.post('/registerNewDevice', async(req: Request, res: Response) => {
    let deviceType = req.body.deviceType;
    let newUUID = uuidv4();
    let appdata = await AppData.getAppDataInstance();

    // TODO: change to convertor
    console.log(deviceType)
    let deviceTypeList= deviceType
    
    // TODO: add try as deviceType can be somting non existent
    await appdata.createNewDevice("new device",newUUID,deviceType,`device/${newUUID}`);
    let newDevice:Device = appdata.getDeviceById(newUUID);
    
    // res.setHeader("Content-Type", "application/json");
    // console.log(newDevice.getAsJson())
    res.status(200);
    // res.json();
    WebSocketServerHandler.updateAppdata();
    res.send(newUUID);
})


router.get('/getData', async(req: Request, res: Response) => {
    let uuid = req.query.uuid;
    let appdata = await AppData.getAppDataInstance();
    
    // TODO: change to convertor
    let uuidString= String(uuid)
    
    res.setHeader("Content-Type", "application/json");
    // TODO: add try as deviceType can be somting non existent
    let device:Device = appdata.getDeviceById(uuidString);
    
    res.status(200);
    res.json(device.getAsJsonForArduino());
    console.log(device.getAsJsonForArduino())

    res.send();

})

router.get('/getTopic', async(req: Request, res: Response) => {
    let uuid = req.query.uuid;
    let appdata = await AppData.getAppDataInstance();

    // TODO: change to convertor
    let uuidString= String(uuid)
    
    res.setHeader("Content-Type", "application/json");
    // TODO: add try as deviceType can be somting non existent
    let device:Device = appdata.getDeviceById(uuidString);
    let pubSubData = {
        topicPath : device.getTopicPath(),
    }

    res.status(200);
    res.json(pubSubData);
    res.send();
})

export { router as deviceRouter };
