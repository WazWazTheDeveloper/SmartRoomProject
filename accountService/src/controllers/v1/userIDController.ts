import express, { Request, Response } from "express"
import * as userService from '../../services/userService'
import { problemDetails } from "../../modules/problemDetails"
import * as  permissionsOptions from "../../modules/permissionOptions"
import { response500 } from "../../modules/errors/500"

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

    try {
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
            if (result.errorCode == 1) {
                return res.status(400).json(problemDetails({
                    type: "about:blank",
                    title: "Bad Request",
                    details: `The UUID (${UUID}) provided does not correspond to any existing user.`,
                    instance: req.originalUrl,
                }))
            }
            return response500(req, res);
        }
        return res.status(200).json(result.permissions)
    } catch (e) {
        return response500(req, res);
    }
}

export async function updateUserPermissions(req: Request, res: Response) {
    try {
        const isAuthorized = await userService.checkUserPermission(req._userID, {
            type: "users",
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

        const { UUID } = req.params
        const { permissionOptions } = req.body

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

        return response500(req, res);
    } catch (e) {
        return response500(req, res);
    }
}

export async function updateUserPermissionGroups(req: Request, res: Response) {
    try {
        const isAuthorized = await userService.checkUserPermission(req._userID, {
            type: "users",
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

        const { UUID } = req.params
        const { permissionOptions } = req.body

        if (!userService.isPermissionGroupOptions(permissionOptions)) {
            return res.status(400).json(problemDetails({
                type: "about:blank",
                title: "Bad Request",
                details: "Invalid data provided. Please ensure that permissionOptions is an array of valid permissionOptions objects.",
                instance: req.originalUrl,
            }))
        }

        const result: boolean = await userService.updateUserPermissionGroups(UUID, permissionOptions)

        if (result) {
            return res.status(200).json('ok')
        }
        return response500(req, res);
    } catch (e) {
        return response500(req, res);
    }
}