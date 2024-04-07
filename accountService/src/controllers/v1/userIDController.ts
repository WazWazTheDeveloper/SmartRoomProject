import express, { Request, Response } from "express"
import * as userService from '../../services/userService'
import { problemDetails } from "../../modules/problemDetails"
import * as  permissionsOptions from "../../modules/permissionOptions"

// IMPLEMENT
export async function getUserPermissions(req: Request, res: Response) {
    const { UUID } = req.params

    if (typeof (UUID) != "string") {
        return res.status(400).json(problemDetails({
            type: "about:blank",
            title: "Bad Request",
            details: "Invalid data provided. Please ensure that UUID is a string.",
            instance: req.originalUrl,
        }))
    }

    const isAuthorized = await userService.checkUserPermission(req._userID, {
        type: "users",
        objectId: UUID,
        permission: "read",
    })

    if (!isAuthorized) {
        return res.status(401).json(problemDetails({
            type: "about:blank",
            title: "Unauthorized",
            details: "User is not authorized to do this function",
            instance: req.originalUrl,
        }))
    }

    const result = await userService.getUserPermissions(UUID)


    if (!result.isSuccessful) {
        return res.status(500).json(problemDetails({
            type: "about:blank",
            title: "Internal server error",
            details: "An unexpected error occurred while processing your request. Please try again later.",
            instance: req.originalUrl,
        }))
    }
    if(result.permissions.length === 0) {
        return res.status(500).json(problemDetails({
            type: "about:blank",
            title: "Bad Request",
            details: `The UUID (${UUID}) provided does not correspond to any existing user.`,
            instance: req.originalUrl,
        }))
    }
    
    return res.status(200).json(result.permissions[0])
}

export async function updateUserPermissions(req: Request, res: Response) {
    const isAuthorized = await userService.checkUserPermission(req._userID, {
        type: "PermissionGroup",
        objectId: "all",
        permission: "write",
    })

    if (!isAuthorized) {
        return res.status(401).json(problemDetails({
            type: "about:blank",
            title: "Unauthorized",
            details: "User is not authorized to do this function",
            instance: req.originalUrl,
        }))
    }

    const { UUID, permissionOptions } = req.params

    if (typeof (UUID) != "string" || !Array.isArray(permissionOptions)) {
        return res.status(400).json(problemDetails({
            type: "about:blank",
            title: "Bad Request",
            details: "Invalid data provided. Please ensure that UUID is a string and permissionOptions is an array.",
            instance: req.originalUrl,
        }))
    }

    if (!permissionsOptions.isPermissionsOptions(permissionOptions)) {
        return res.status(400).json(problemDetails({
            type: "about:blank",
            title: "Bad Request",
            details: "Invalid data provided. Please ensure that permissionOptions is an array of valid permissionOptions objects.",
            instance: req.originalUrl,
        }))
    }

    const result: boolean = await userService.updateUserPermissions(UUID, permissionOptions)

    if (result) {
        return res.status(200).json('ok')
    }
    return res.status(500).json(problemDetails({
        type: "about:blank",
        title: "Bad Request",
        details: "An unexpected error occurred while processing your request. Please try again later.",
        instance: req.originalUrl,
    }))
}