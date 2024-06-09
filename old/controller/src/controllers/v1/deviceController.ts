import express, { Request, Response, NextFunction } from "express"
import { DeviceDataTypesConfigs } from "../../interfaces/deviceData.interface";
import * as deviceService from "../../services/deviceService"
import asyncHandler from "express-async-handler"
import { problemDetails } from "../../models/problemDetails";
import { verifyPermissions } from "../../utils/verifyPermissions";
import { response401 } from "../../models/errors/401";

export const createNewDevice = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let { deviceName, dataTypeArray, origin } = req.body;
    if (!dataTypeArray || !Array.isArray(dataTypeArray) || typeof origin != "string") {
        res.status(400).json(problemDetails({
            type: "about:blank",
            title: "Bad Request",
            details: "Bad request. Please ensure dataTypeArray is provided and of type Array, and origin is a string.",
            instance: req.originalUrl,
        }))
        return
    }

    if (!deviceName) {
        deviceName = "unnamed device"
    }

    // @ts-ignore we check for req.headers.authorization in middleware
    let result = await verifyPermissions(req.headers.authorization, req._userID, "device", "all", "write")
    if (result) {
        let device = await deviceService.createDevice(deviceName, origin, dataTypeArray as DeviceDataTypesConfigs[])
        if (device.isSuccessful) {
            res.status(200);
            res.send(device.device._id);
        }
        else {
            res.status(400).json(problemDetails({
                type: "about:blank",
                title: "Bad Request",
                details: "Bad request. Please ensure dataTypeArray is correctly formated",
                instance: req.originalUrl,
            }))
            return
        }

    }
    else {
        response401(req, res)
        return
    }
})


export const deleteDevice = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { deviceID } = req.body
    if (!deviceID) {
        res.status(400).json(problemDetails({
            type: "about:blank",
            title: "Bad Request",
            details: "Bad request. Please provide a device ID.",
            instance: req.originalUrl,
        }))
        return
    }

    // @ts-ignore we check for req.headers.authorization in middleware
    let result = await verifyPermissions(req.headers.authorization, req._userID, "device", deviceID, "delete")
    if (result) {
        deviceService.deleteDevice(deviceID)
        res.status(200).send("ok");
        return
    }
    else {
        response401(req, res)
        return
    }

})

export const updateDevice = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { updateList } = req.body
    if (!updateList || !Array.isArray(updateList)) {
        res.status(400).json(problemDetails({
            type: "about:blank",
            title: "Bad Request",
            details: "Bad request. Please provide an array of updateList",
            instance: req.originalUrl,
        }))
        return
    }

    // TODO: create api endpoint that can handle an array insted of sending a request updateList.length times
    for (let index = 0; index < updateList.length; index++) {
        const id = updateList[index]._id;
        // @ts-ignore we check for req.headers.authorization in middleware
        let result = await verifyPermissions(req.headers.authorization, req._userID, "device", id, "write")
        if (!result) {
            response401(req, res)
            return
        }
    }


    const result = await deviceService.updateDeviceProperties(updateList)
    if (result.isSuccessful) {
        res.status(200).send("ok");
    }

    next()
})