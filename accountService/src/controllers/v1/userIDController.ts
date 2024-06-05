import express, { Request, Response, NextFunction } from "express"
import * as userService from '../../services/userService'
import { problemDetails } from "../../modules/problemDetails"
import * as  permissionsOptions from "../../modules/permissionOptions"
import { response500 } from "../../modules/errors/500"
import asyncHandler from "express-async-handler"
import { response401 } from "../../modules/errors/401"

export const getUserPermissions = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { UUID } = req.params
    const { permission_type } = req.query

    if (!((permission_type == "topic" ||
        permission_type == "device" ||
        permission_type == "task" ||
        permission_type == "permissionGroup" ||
        permission_type == "users")) && typeof (permission_type) == "string") {

    }

    if (typeof (permission_type) == "string") {
        if (!(permission_type == "topic" ||
            permission_type == "device" ||
            permission_type == "task" ||
            permission_type == "permissionGroup" ||
            permission_type == "users")) {
            res.status(400).json(problemDetails({
                type: "about:blank",
                title: "Bad Request",
                details: "Invalid permission_type provided.",
                instance: req.originalUrl,
            }))
            return
        }
    }

    if (typeof (UUID) != "string") {
        res.status(400).json(problemDetails({
            type: "about:blank",
            title: "Bad Request",
            details: "Invalid data provided. Please ensure that UUID is a string.",
            instance: req.originalUrl,
        }))
        return
    }

    const isAuthorized = await userService.checkUserPermission(req._userID, {
        type: "users",
        objectId: UUID,
        permission: "read",
    })

    if (!isAuthorized) {
        response401(req, res);
        return
    }

    let result
    if (permission_type) {
        result = await userService.getUserPermissionsOfType(UUID, permission_type as string)
    } else {
        result = await userService.getUserPermissions(UUID)
    }


    if (!result.isSuccessful) {
        if (result.errorCode == 1) {
            res.status(400).json(problemDetails({
                type: "about:blank",
                title: "Bad Request",
                details: `The UUID (${UUID}) provided does not correspond to any existing user.`,
                instance: req.originalUrl,
            }))
            return
        }
        response500(req, res);
        return
    }
    res.status(200).json(result.permissions)
})

export const updateUserPermissions = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const isAuthorized = await userService.checkUserPermission(req._userID, {
        type: "users",
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

    const result: boolean = await userService.updateUserPermissions(UUID, permissionOptions)

    if (result) {
        res.status(200).json('ok')
    }

    next()
})

export const updateUserPermissionGroups = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const isAuthorized = await userService.checkUserPermission(req._userID, {
        type: "users",
        objectId: "all",
        permission: "write",
    })

    if (!isAuthorized) {
        response401(req, res);
        return
    }

    const { UUID } = req.params
    const { permissionOptions } = req.body

    if (!userService.isPermissionGroupOptions(permissionOptions)) {
        res.status(400).json(problemDetails({
            type: "about:blank",
            title: "Bad Request",
            details: "Invalid data provided. Please ensure that permissionOptions is an array of valid permissionOptions objects.",
            instance: req.originalUrl,
        }))
        return
    }

    const result: boolean = await userService.updateUserPermissionGroups(UUID, permissionOptions)

    if (result) {
        res.status(200).json('ok')
    }

    next()
})

export const checkUserPermission = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const isAuthorized = await userService.checkUserPermission(req._userID, {
        type: "users",
        objectId: "all",
        permission: "read",
    })

    if (!isAuthorized) {
        response401(req, res);
        return
    }

    const { UUID } = req.params
    const { type, objectid, permission } = req.query

    if (typeof (type) != "string" || typeof (UUID) != "string" || typeof (objectid) != "string" || typeof (permission) != "string") {
        res.status(400).json(problemDetails({
            type: "about:blank",
            title: "Bad Request",
            details: "Invalid data provided. Please ensure that 'type', 'objectid', and 'permission' are strings.",
            instance: req.originalUrl,
        }))
        return
    }

    // TODO: remove ts-ignore
    const result = await userService.checkUserPermission(UUID, {
        // @ts-ignore
        type: type,
        objectId: objectid,
        // @ts-ignore
        permission: permission
    })

    if (result) {
        res.status(200).json({
            hasPermission: true
        })
    } else {
        res.status(200).json({
            hasPermission: false
        })
    }
})

export const updateDarkMode = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const isAuthorized = await userService.checkUserPermission(req._userID, {
        type: "users",
        objectId: req._userID,
        permission: "write",
    })

    if (!isAuthorized) {
        response401(req, res);
        return
    }

    const { isDarkmode } = req.body

    if (typeof (isDarkmode) != "boolean") {
        res.status(400).json(problemDetails({
            type: "about:blank",
            title: "Bad Request",
            details: "Invalid data provided. Please ensure that isDarkmode is of type boolean.",
            instance: req.originalUrl,
        }))
        return
    }

    const result = await userService.updateUserDarkMode(req._userID, isDarkmode)
    if (result) {
        res.status(204).send()
    } else {
        response500(req, res)
    }
})

export const setUserSettings = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const isAuthorized = await userService.checkUserPermission(req._userID, {
        type: "users",
        objectId: req._userID,
        permission: "read",
    })

    if (!isAuthorized) {
        response401(req, res);
        return
    }

    const result = await userService.getUserSettings(req._userID)
    if (!result.isSuccessful) {
        response500(req, res);
        return
    }

    res.status(200).json(result.userSettings)
    return
})

export const getUserFavoriteDevices = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

})

export const updateUserFavoriteDevices = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { UUID } = req.params

    if (typeof (UUID) != "string") {
        res.status(400).json(problemDetails({
            type: "about:blank",
            title: "Bad Request",
            details: "Invalid data provided. Please ensure that 'UUID' is string.",
            instance: req.originalUrl,
        }))
        return
    }

    const isAuthorized = await userService.checkUserPermission(req._userID, {
        type: "users",
        objectId: UUID,
        permission: "write",
    })

    if (!isAuthorized) {
        response401(req, res);
        return
    }
    

})