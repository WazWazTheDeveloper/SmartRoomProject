import express, { NextFunction, Request, Response } from "express"
import { WebSocketServerHandler } from "../handlers/webSocketServerHandler";
import { v4 as uuidv4 } from 'uuid';
import { AppData } from "../appData";
import { Device } from "../models/device";
import { User } from "../models/user";


const createNewDevice = async (req: Request, res: Response) => {
    let deviceType = req.body.deviceType;
    let newUUID = uuidv4();
    let appdata = await AppData.getAppDataInstance();

    console.log(deviceType)
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
        res.send(newUUID);
    } catch (err) {
        res.status(404);
        res.send();
        return;
    }
}


const getData = async (req: Request, res: Response) => {
    let uuid = req.query.uuid;
    let dataAtString = req.query.dataat;

    let appdata = await AppData.getAppDataInstance();

    let uuidString = String(uuid)
    if (!(dataAtString instanceof String)) {
        dataAtString = "0"
    }
    let dataAt = Number(dataAtString);

    res.setHeader("Content-Type", "application/json");

    try {
        let device: Device = appdata.getDeviceById(uuidString);
        res.status(200);
        let data = device.getAsJsonForArduino(dataAt)
        res.json({
            data: data
        });
    } catch {
        res.status(404);
    }

    res.send();
}

const getTopic = async (req: Request, res: Response) => {
    let uuid = req.query.uuid;
    let appdata = await AppData.getAppDataInstance();

    let uuidString = String(uuid)

    res.setHeader("Content-Type", "application/json");
    try {
        let device: Device = appdata.getDeviceById(uuidString);
        let pubSubData = {
            topicPath: device.getTopicPath(),
        }
        res.status(200);
        res.json(pubSubData);

    } catch (err) {
        console.log("topic not found")
        res.status(404);
    }

    res.send();
}

const update_device = async (req: Request, res: Response) => {
    const { dataAt, data, targetDevice } = req.body;
    if ((!dataAt && dataAt !== 0) || !data || !targetDevice) {
        res.status(400).json('invalid data')
        return
    }

    let appdata = await AppData.getAppDataInstance()

    let foundDevice: Device;
    try {
        foundDevice = await appdata.getDeviceById(targetDevice);
    } catch (err) {
        res.status(401).json('Device does not exist')
        return
    }


    await foundDevice.setData(dataAt, data)

    res.status(200).json('success')
}

const delete_device = async (req: Request, res: Response) => {
    // TODO: add verification for permissions
    let uuid = req.query.uuid;
    let appdata = await AppData.getAppDataInstance();

    let uuidString = String(uuid)

    await appdata.removeDevice(uuidString);
    res.status(200).json('success');
}

export { createNewDevice, getData, getTopic, update_device, delete_device }