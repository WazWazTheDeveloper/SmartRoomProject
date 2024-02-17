import { Request, Response } from "express";
import { DeviceDataTypesConfigs } from "../../interfaces/deviceData.interface";
import * as deviceService from "../../services/deviceService"

export async function createNewDevice(req: Request, res: Response) {
    let { deviceName, dataTypeArray } = req.body;
    if (!dataTypeArray || !Array.isArray(dataTypeArray)) {
        res.status(400).json("invalid request")
        return
    }

    if (!deviceName) {
        deviceName = "unnamed device"
    }

    try {
        let device = await deviceService.createDevice(deviceName, dataTypeArray as DeviceDataTypesConfigs[])
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

export function updateDevice(req: Request, res: Response) {
    const { deviceID } = req.body
    let x = "180aaf43-3933-4e90-a6cd-d68a8797e410"
    deviceService.updateDeviceProperties(x,[{
        propertyName: "deviceName",
        newValue: "11123"
    }])

    res.status(200).send("ok");
}