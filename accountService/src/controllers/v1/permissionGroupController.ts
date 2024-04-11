import express, { Request, Response, NextFunction } from "express"
import * as permissionGroupsService from '../../services/permissionGroupsService'
import { checkUserPermission } from "../../services/userService";
import { problemDetails } from "../../modules/problemDetails";
import * as userService from '../../services/userService'
import * as  permissionsOptions from "../../modules/permissionOptions"
import asyncHandler from "express-async-handler"
import { response401 } from "../../modules/errors/401";

export const createNewGroup = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    //check permissions
    const isAuthorized = await checkUserPermission(req._userID, {
        type: "PermissionGroup",
        objectId: "all",
        permission: "write",
    })

    if (!isAuthorized) {
        response401(req, res);
        return
    }

    const { groupName, groupDescription } = req.body;
    if (typeof groupName != 'string' || typeof groupDescription != 'string') {
        res.status(400).json(problemDetails({
            type: "about:blank",
            title: "Bad Request",
            details: "Invalid data provided. Please ensure that groupName and groupDescription are of type string.",
            instance: req.originalUrl,
        }))
        return
    }

    let result = await permissionGroupsService.createNewGroup(groupName, groupDescription);

    if (result.isSuccessful) {
        res.status(200).json("ok")
    }

    next()
})

export const updateGroupPermissions = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const isAuthorized = await userService.checkUserPermission(req._userID, {
        type: "PermissionGroup",
        objectId: "all",
        permission: "write",
    })

    if (!isAuthorized) {
        response401(req, res);
        return
    }

    const { UUID } = req.params
    const { permissionOptions } = req.body

    if (typeof (UUID) != "string" || !Array.isArray(permissionOptions)) {
        res.status(400).json(problemDetails({
            type: "about:blank",
            title: "Bad Request",
            details: "Invalid data provided. Please ensure that UUID is a string and permissionOptions is an array.",
            instance: req.originalUrl,
        }))
        return
    }

    if (!permissionsOptions.isPermissionsOptions(permissionOptions)) {
        res.status(400).json(problemDetails({
            type: "about:blank",
            title: "Bad Request",
            details: "Invalid data provided. Please ensure that permissionOptions is an array of valid permissionOptions objects.",
            instance: req.originalUrl,
        }))
        return 
    }

    const result: boolean = await permissionGroupsService.updateGroupPermission(UUID, permissionOptions)

    if (result) {
        res.status(200).json('ok')
        return 
    }

    next()
})