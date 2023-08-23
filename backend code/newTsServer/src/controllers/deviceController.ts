import express, { NextFunction, Request, Response } from "express"
import { WebSocketServerHandler } from "../handlers/WebSocketServerHandler";
import { v4 as uuidv4 } from 'uuid';
import { AppData } from "../appData";
import { Device } from "../models/device";
import { User } from "../models/user";

const createNewDevice = async (req: Request, res: Response) => {
    let deviceType = req.body.deviceType;
    let newUUID = uuidv4();
    let appdata = await AppData.getAppDataInstance();

    console.log(deviceType[0])
    // check if deviceType is array of numbers
    for (let index = 0; index < deviceType.length; index++) {
        const element = deviceType[index];
        if (isNaN(element)) {
            res.status(400);
            res.send();
            return;
        }

    }

    try {
        await appdata.createNewDevice("new device", newUUID, deviceType, `device/${newUUID}`);
        let newDevice: Device = appdata.getDeviceById(newUUID);
        res.status(200);
        WebSocketServerHandler.updateAppdata();
        res.send(newUUID);
    } catch (err) {
        res.status(400);
        res.send();
        return;
    }
}


const getData = async (req: Request, res: Response) => {
    let uuid = req.query.uuid;
    let appdata = await AppData.getAppDataInstance();
    console.log(req.query)
    let uuidString = String(uuid)

    res.setHeader("Content-Type", "application/json");

    // TODO: add try as deviceType can be somting non existent
    // try {
    let device: Device = appdata.getDeviceById(uuidString);
    res.status(200);
    // TODO: add device at to queery
    let data = device.getAsJsonForArduino(0)
    res.json({
        data: data
    });
    // console.log(device.getAsJsonForArduino(0))
    // }catch {
    //     res.status(400);
    // }



    res.send();
}

const getTopic = async (req: Request, res: Response) => {
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
}

const test = async (req: Request, res: Response) => {
    let deviceType = [0];
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
    // console.log(req.query)
    // res.send("ter")
    // User.createNewUser("test2", "123");
}

export { createNewDevice, getData, getTopic, test }