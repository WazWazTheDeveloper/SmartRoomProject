import express, { Request, Response } from "express"
import { AppData } from "../AppData";
import bodyParser from "body-parser";


const router: express.Router = express.Router();

router.use((req: Request, res: Response, next) => {
    // TODO: add a check to auth
    next()
});

//TODO: delete this as using websocket for this stuff
router.post('/addGeneralTopic', async (req: Request, res: Response) => {
    let topicName = req.body.topicName
    let topicPath = req.body.topicPath
    if (!topicName && !topicPath) {
        res.status(400)
        res.send("empty string");
        return
    }
    let appdata = await AppData.getAppDataInstance();

    try {
        await appdata.addGeneralTopic(String(topicName), String(topicPath), true)
        res.send("added general topic");
    } catch (err) {
        res.status(400)
        res.send("general topic already exist");
    }

})

//TODO: delete this as using websocket for this stuff
router.post('/removeGeneralTopic', async (req: Request, res: Response) => {
    let topicName = req.body.topicName
    let topicPath = req.body.topicPath
    if (!topicName && !topicPath) {
        res.status(400)
        res.send("empty string");
        return
    }
    let appdata = await AppData.getAppDataInstance();

    try {
        await appdata.removeGeneralTopic(String(topicName))
        res.send("removed general topic");
    } catch (err) {
        // will never get triggered as removeGeneralTopic() never checks is topic exist
        res.status(400)
        res.send("general topic doesn't exist");
    }
})

//TODO: delete this as using websocket for this stuff
router.post('/addListenToTopicToDevice', async (req: Request, res: Response) => {
    let deviceUUID = req.body.deviceUUID
    let topicName = req.body.topicName
    let event = req.body.event
    let dataType = req.body.datatype
    let functionType = req.body.functionType


    //TODO: add data validation
    if (!topicName && !deviceUUID && !event && !dataType && !functionType) {
        res.status(400)
        res.send("empty string");
        return
    }

    deviceUUID = String(deviceUUID)
    topicName = String(topicName);
    event = String(event);
    dataType = String(dataType);
    functionType = String(functionType);

    let appdata = await AppData.getAppDataInstance();
    try {
        let generalTopic = await appdata.getGeneralData().getTopicByName(topicName)
        appdata.addListenToTopicToDevice(deviceUUID, generalTopic, dataType, true, event, { "functionType": functionType })
        res.status(200).send();
    } catch (err) {
        res.status(400)
        res.send("invalid topicName");
        return
    }
})

//TODO: delete this as using websocket for this stuff
router.post('/removeListenToTopicFromDevice', async (req: Request, res: Response) => {
    let deviceUUID = req.body.deviceUUID
    let topicName = req.body.topicName
    let event = req.body.event
    let dataType = req.body.dataType
    let functionType = req.body.functionType

    //TODO: add data validation
    if (!topicName && !deviceUUID && !event && !dataType && !functionType) {
        res.status(400)
        res.send("empty string");
        return
    }

    deviceUUID = String(deviceUUID);
    topicName = String(topicName);
    event = String(event);
    dataType = String(dataType);
    functionType = String(functionType);


    let appdata = await AppData.getAppDataInstance();
    try {
        let generalTopic = await appdata.getGeneralData().getTopicByName(topicName)
        appdata.removeListenToTopicToDevice(deviceUUID, generalTopic, dataType, event, { "functionType": functionType })
        res.status(200).send();
    } catch (err) {
        res.status(400)
        res.send("invalid topicName");
        return
    }
})

export { router as appdataRouter }