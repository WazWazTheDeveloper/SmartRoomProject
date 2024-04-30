import express, { Request, Response, NextFunction } from "express"
import asyncHandler from "express-async-handler"
import { problemDetails } from "../../models/problemDetails";
import { response401 } from "../../models/errors/401";
import { verifyPermissions } from "../../utils/verifyPermissions";
import * as deviceService from "../../services/deviceService"


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

})

export const getAlldevices = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

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
    //get all permissions of user
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

    let _updateList : any[] = []
    for (let index = 0; index < updateList.length; index++) {
        const element = updateList[index];
        _updateList.push({
            id: UUID,
            propertyToChange : element
        })
    }

    const result = await deviceService.updateDeviceProperties(_updateList)
    if (result.isSuccessful) {
        res.status(200).send("ok");
    }

    next()
})