import express, { NextFunction, Request, Response } from "express"
import { WebSocketServerHandler } from "../handlers/webSocketServerHandler";
import { v4 as uuidv4 } from 'uuid';
import { AppData } from "../appData";
import { Device } from "../models/device";
import { User } from "../models/user";


export const createNewDevice = async (req: Request, res: Response) => {
    const {deviceType,deviceName} = req.body;
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
    let _deviceName = deviceName
    if(!deviceName) {
        _deviceName = "new Device"
    }

    try {
        await appdata.createNewDevice(_deviceName, newUUID, deviceType, `device/${newUUID}`);
        let newDevice: Device = appdata.getDeviceById(newUUID);
        res.status(200);
        res.send(newUUID);
    } catch (err) {
        res.status(404);
        res.send();
        return;
    }
}


export const getData = async (req: Request, res: Response) => {
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

export const getTopic = async (req: Request, res: Response) => {
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

export const update_device = async (req: Request, res: Response) => {
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

    if(foundDevice.getIsAccepted() != 1) {
        res.status(401).json('Device is not accepted yet')
        return
    }


    await foundDevice.setData(dataAt, data)

    res.status(200).json('success')
}

export const delete_device = async (req: Request, res: Response) => {
    let uuid = req.query.uuid;
    let appdata = await AppData.getAppDataInstance();

    let uuidString = String(uuid)

    await appdata.removeDevice(uuidString);
    res.status(200).json('success');
}

export const update_name = async (req:Request, res:Response) => {
    const { targetDevice,newName } = req.body;
    // TODO: maybe add max character limit or somting
    if (!newName || !targetDevice) {
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


    await foundDevice.setDeviceName(newName);

    res.status(200).json('success')
}

export const setIsAccepted = async (req:Request, res:Response) => {
    const { targetDevice,isAccepted } = req.body;
    // TODO: maybe add max character limit or somting
    if (!targetDevice || !(typeof isAccepted === 'number')) {
        res.status(400).json('invalid data')
        return
    }
    if(isAccepted != 1 && isAccepted != 0 && isAccepted != -1) {
        res.status(400).json('invalid data')
    }

    let appdata = await AppData.getAppDataInstance()

    let foundDevice: Device;
    try {
        foundDevice = await appdata.getDeviceById(targetDevice);
    } catch (err) {
        res.status(401).json('Device does not exist')
        return
    }

    // @ts-ignore
    await foundDevice.setIsAccepted(isAccepted);

    res.status(200).json('success')
}
