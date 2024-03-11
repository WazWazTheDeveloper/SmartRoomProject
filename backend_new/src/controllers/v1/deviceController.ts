import { Request, Response } from "express";
import { DeviceDataTypesConfigs } from "../../interfaces/deviceData.interface";
import * as deviceService from "../../services/deviceService"

export async function createNewDevice(req: Request, res: Response) {
    let { deviceName, dataTypeArray, origin } = req.body;
    if (!dataTypeArray || !Array.isArray(dataTypeArray) || typeof origin != "string") {
        res.status(400).json("invalid request")
        return
    }

    if (!deviceName) {
        deviceName = "unnamed device"
    }

    try {
        let device = await deviceService.createDevice(deviceName,origin, dataTypeArray as DeviceDataTypesConfigs[])
        if (device.isSuccessful) {
            res.status(200);
            res.send(device.device._id);
        }
        else[
            res.status(400).json("invalid request")
        ]
    } catch (e) {
        // add logs
        console.log(e)
        res.status(400).json("invalid request")
    }
}

export function deleteDevice(req: Request, res: Response) {
    const { deviceID } = req.body
    if (!deviceID) {
        res.status(400).json("invalid request")
        return
    }

    deviceService.deleteDevice(deviceID)

    res.status(200).send("ok");
}

export async function updateDevice(req: Request, res: Response) {
    const { updateList } = req.body
    if (!updateList || !Array.isArray(updateList)){
        res.status(400).json("invalid request")
        return
    }

    const result = await deviceService.updateDeviceProperties(updateList)
    if(result.isSuccessful) {
        res.status(200).send("ok");
    }else {
        res.status(400).json(result.error);
    }

}