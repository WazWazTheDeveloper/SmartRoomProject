import express, { Request, Response, NextFunction } from "express"
import asyncHandler from "express-async-handler"
import { problemDetails } from "../../models/problemDetails";
import { response401 } from "../../models/errors/401";
import { verifyPermissions } from "../../utils/verifyPermissions";
import * as deviceService from "../../services/deviceService"
import axios from "axios";
import { getRequestUUID } from "../../middleware/requestID";
import { response500 } from "../../models/errors/500";


export const updateDevices = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
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

export const getDeviceWithArray = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    type TResponseData = {
        _id: String
        isAdmin: boolean
        permissions: {
            type: "topic" | "device" | "task" | "permissionGroup" | "users"
            objectId: string | "all"
            read: boolean
            write: boolean
            delete: boolean
        }[]
    }

    const { deviceIDList } = req.body
    if (!deviceIDList || !Array.isArray(deviceIDList)) {
        res.status(400).json(problemDetails({
            type: "about:blank",
            title: "Bad Request",
            details: "Bad request. Please ensure that deviceIDList is array of strings",
            instance: req.originalUrl,
        }))
        return
    }

    const deviceIDWithPermissions: string[] = []

    // im too lazy to make proper api endpoint to check multiple permission at once :)
    for (let index = 0; index < deviceIDList.length; index++) {
        const deviceID = deviceIDList[index];
        if (typeof (deviceID) != "string") {
            res.status(400).json(problemDetails({
                type: "about:blank",
                title: "Bad Request",
                details: `Bad request. Please ensure that deviceIDList[${index}] is strings`,
                instance: req.originalUrl,
            }))
            return
        }
        // @ts-ignore we check for req.headers.authorization in middleware
        let permissionResult = await verifyPermissions(req.headers.authorization, req._userID, "device", deviceID, "read")
        if (!permissionResult) continue

        deviceIDWithPermissions.push(deviceID);
    }

    const devices = await deviceService.getDeviceArray(deviceIDWithPermissions);
    
    if (devices.isSuccessful) {
        res.status(200).json(devices.device)
    } else {
        response500(req, res)
    }
})

export const getAlldevices = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    type TResponseData = {
        _id: String
        isAdmin: boolean
        permissions: {
            type: "topic" | "device" | "task" | "permissionGroup" | "users"
            objectId: string | "all"
            read: boolean
            write: boolean
            delete: boolean
        }[]
    }
    const result = await axios.get(`http://${process.env.ACCOUNT_SERVICE as string}/api/v1/user/${req._userID}/permission`, {
        headers: {
            "X-Request-ID": getRequestUUID(),
            Authorization: req.headers.authorization
        }
    })
    const resultData: TResponseData = result.data

    const devicesID = []
    let canSeeAll = false;

    for (let i = 0; i < resultData.permissions.length; i++) {
        const permission = resultData.permissions[i];
        if (permission.type == "device" && permission.read == true) {
            if (permission.objectId = "all") {
                canSeeAll = true;
            }
            devicesID.push(permission.objectId)
        }
    }

    let devices: deviceService.DevicesResult;
    if (resultData.isAdmin || canSeeAll) {
        devices = await deviceService.getAllDevices();
    }
    else {
        devices = await deviceService.getDeviceArray(devicesID);
    }

    if (devices.isSuccessful) {
        res.status(200).json(devices.device)
    } else {
        response500(req, res)
    }
})

export const deleteDevice = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { UUID } = req.params
    if (!UUID) {
        res.status(400).json(problemDetails({
            type: "about:blank",
            title: "Bad Request",
            details: "Bad request. Please provide a device ID.",
            instance: req.originalUrl,
        }))
        return
    }

    // @ts-ignore we check for req.headers.authorization in middleware
    let result = await verifyPermissions(req.headers.authorization, req._userID, "device", UUID, "delete")
    if (result) {
        deviceService.deleteDevice(UUID)
        res.status(200).send("ok");
        return
    }
    else {
        response401(req, res)
        return
    }
})

export const getDevice = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { UUID } = req.params
    if (!UUID) {
        res.status(400).json(problemDetails({
            type: "about:blank",
            title: "Bad Request",
            details: "Bad request. Please provide a device ID.",
            instance: req.originalUrl,
        }))
        return
    }

    // @ts-ignore we check for req.headers.authorization in middleware
    let permissionResult = await verifyPermissions(req.headers.authorization, req._userID, "device", UUID, "read")
    if (!permissionResult) {
        response401(req, res)
        return
    }

    const result = await deviceService.getDevice(UUID)
    if (result.isSuccessful) {
        res.status(200).json(result.device);
    }
})

export const updateDevice = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { updateList } = req.body
    const { UUID } = req.params
    if (!updateList || !Array.isArray(updateList)) {
        res.status(400).json(problemDetails({
            type: "about:blank",
            title: "Bad Request",
            details: "Bad request. Please provide an array of updateList",
            instance: req.originalUrl,
        }))
        return
    }

    if (!UUID) {
        res.status(400).json(problemDetails({
            type: "about:blank",
            title: "Bad Request",
            details: "Bad request. Please provide a device ID.",
            instance: req.originalUrl,
        }))
        return
    }

    // @ts-ignore we check for req.headers.authorization in middleware
    let permissionResult = await verifyPermissions(req.headers.authorization, req._userID, "device", UUID, "write")
    if (!permissionResult) {
        response401(req, res)
        return
    }

    let _updateList: any[] = []
    for (let index = 0; index < updateList.length; index++) {
        const element = updateList[index];
        _updateList.push({
            _id: UUID,
            propertyToChange: element
        })
    }

    const result = await deviceService.updateDeviceProperties(_updateList)
    if (result.isSuccessful) {
        res.status(200).send("ok");
    } else {
        console.log(result)
        response500(req, res);
    }
})