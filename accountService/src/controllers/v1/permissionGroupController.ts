import { Request, Response } from "express"
import * as permissionGroupsService from '../../services/permissionGroupsService'
import { checkUserPermission } from "../../services/userService";
import { problemDetails } from "../../modules/problemDetails";
import * as userService from '../../services/userService'
import * as  permissionsOptions from "../../modules/permissionOptions"

export async function createNewGroup(req: Request, res: Response) {
    //check permissions
    const isAuthorized = await checkUserPermission(req._userID, {
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

    const { groupName, groupDescription } = req.body;
    if (typeof groupName != 'string' || typeof groupDescription != 'string') {
        return res.status(400).json(problemDetails({
            type: "about:blank",
            title: "Bad Request",
            details: "Invalid data provided. Please ensure that groupName and groupDescription are of type string.",
            instance: req.originalUrl,
        }))
    }

    let result = await permissionGroupsService.createNewGroup(groupName, groupDescription);

    if (result.isSuccessful) {
        return res.status(200).json("ok")
    }
    else {
        return res.status(500).json(problemDetails({
            type: "about:blank",
            title: "Bad Request",
            details: "An unexpected error occurred while processing your request. Please try again later.",
            instance: req.originalUrl,
        }))
    }
}

export async function updateGroupPermissions(req: Request, res: Response) {
    const isAuthorized = await userService.checkUserPermission(req._userID, {
        type: "PermissionGroup",
        objectId: "all",
        permission: "write",
    })

    if(!isAuthorized) {
        return res.status(401).json(problemDetails({
            type : "about:blank",
            title:"Unauthorized",
            details: "User is not authorized to do this function",
            instance: req.originalUrl,
        }))
    }

    const { UUID } = req.params
    const { permissionOptions } = req.body

    if (typeof (UUID) != "string" || !Array.isArray(permissionOptions)) {
        return res.status(400).json(problemDetails({
            type : "about:blank",
            title:"Bad Request",
            details: "Invalid data provided. Please ensure that UUID is a string and permissionOptions is an array.",
            instance: req.originalUrl,
        }))
    }

    if (!permissionsOptions.isPermissionsOptions(permissionOptions)) {
        return res.status(400).json(problemDetails({
            type : "about:blank",
            title:"Bad Request",
            details: "Invalid data provided. Please ensure that permissionOptions is an array of valid permissionOptions objects.",
            instance: req.originalUrl,
        }))
    }

    const result: boolean = await permissionGroupsService.updateGroupPermission(UUID, permissionOptions)

    if (result) {
        return res.status(200).json('ok')
    }
    return res.status(500).json(problemDetails({
        type : "about:blank",
        title:"Bad Request",
        details: "An unexpected error occurred while processing your request. Please try again later.",
        instance: req.originalUrl,
    }))
}