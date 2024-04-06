import { Request, Response } from "express"
import * as permissionGroupsService from '../../services/permissionGroupsService'
import { checkUserPermission } from "../../services/userService";
import { problemDetails } from "../../modules/problemDetails";
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