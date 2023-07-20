import express, { Request, Response } from "express"
import { AppData } from "../AppData";


const router: express.Router = express.Router();

router.use((req: Request, res: Response, next) => {
    next()
});

// TODO: change to post
router.get('/addGeneralTopic', async (req: Request, res: Response) => {
    // TODO: add a check to auth
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
    } catch(err) {
        res.status(400)
        res.send("general topic already exist");
    }

})

// TODO: change to post
router.get('/removeGeneralTopic', async(req: Request, res: Response) => {
    // TODO: add a check to auth
    let topicName = req.query.topicName
    let topicPath = req.query.topicPath
    if (!topicName && !topicPath) {
        res.status(400)
        res.send("empty string");
        return
    }
    let appdata = await AppData.getAppDataInstance();

    try {
        await appdata.removeGeneralTopic(String(topicName))
        res.send("removed general topic");
    } catch(err) {
        // will never get triggered as removeGeneralTopic() never checks is topic exist
        res.status(400)
        res.send("general topic doesn't exist");
    }
})

// TODO: change to post
router.get('/addListenToTopicToDevice', async(req: Request, res: Response) => {
    // TODO: add a check to auth
    let deviceUUID = req.query.deviceUUID
    let topicName = req.query.topicName
    let event = req.query.event
    let dataType = req.query.datatype
    let functionType = req.query.functionType
    
    
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

    //TODO: add try catch when getting topic by name as it can throw error
    let appdata = await AppData.getAppDataInstance();
    let generalTopic = await appdata.getGeneralData().getTopicByName(topicName)
    appdata.addListenToTopicToDevice(deviceUUID,generalTopic,dataType,true,event,{"functionType":functionType})
})

// TODO: change to post
router.get('/removeListenToTopicFromDevice', async(req: Request, res: Response) => {
    // TODO: add a check to auth
    let deviceUUID = req.query.deviceUUID
    let topicName = req.query.topicName
    let event = req.query.event
    let dataType = req.query.dataType
    let functionType = req.query.functionType
    
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


    //TODO: add try catch when getting topic by name as it can throw error
    let appdata = await AppData.getAppDataInstance();
    let generalTopic = await appdata.getGeneralData().getTopicByName(topicName)
    appdata.removeListenToTopicToDevice(deviceUUID,generalTopic,dataType,event,{"functionType":functionType})
})

export { router as appdataRouter }