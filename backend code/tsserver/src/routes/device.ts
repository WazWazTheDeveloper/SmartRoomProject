import express, { Request, Response } from "express"
import { v4 as uuidv4 } from 'uuid';
import { Device } from "../classes/device";
import { AppData } from "../AppData";
import { WebSocketServerHandler } from "../WebSocketServerHandler";



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
    
    // TODO: add try as deviceType can be somting non existent
    await appdata.addDevice("new device",newUUID,deviceType);
    let newDevice:Device = appdata.getDeviceById(newUUID);
    
    res.setHeader("Content-Type", "application/json");
    console.log(newDevice.getAsJson())
    res.status(200);
    res.json(newDevice.getAsJsonForArduino());
    console.log(newDevice.getAsJsonForArduino());
    WebSocketServerHandler.updateAppdata();
    res.send()
})

export { router as deviceRouter };
