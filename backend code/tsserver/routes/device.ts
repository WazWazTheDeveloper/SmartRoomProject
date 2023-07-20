import express, { Request, Response } from "express"
import { v4 as uuidv4 } from 'uuid';
import { Device } from "../classes/device";
import { AppData } from "../AppData";


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

router.get('/registerNewDevice', async(req: Request, res: Response) => {
    let x = Device.AIRCONDITIONER_TYPE
    let newUUID = uuidv4();
    let appdata = await AppData.getAppDataInstance();

    await appdata.addDevice("new device",newUUID,[x]);
    let newDevice = appdata.getDeviceById(newUUID);


    res.setHeader("Content-Type", "application/json");
    res.status(200);
    res.json(newDevice.getAsJson());
    res.send()
})

export { router as deviceRouter };
