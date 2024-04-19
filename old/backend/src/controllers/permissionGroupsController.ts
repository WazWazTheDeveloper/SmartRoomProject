import express, { Request, Response } from "express"
import { AppData } from "../appData";
import { PermissionGroup } from "../models/permissionGroup";

export const getAllGroups = async (req: Request, res: Response) => {
    let appdata = await AppData.getAppDataInstance();
    let _permissionGroups = []

    for (let index = 0; index < appdata.getGeneralData().getPermissionGroupList().length; index++) {
        const generalGroup = appdata.getGeneralData().getPermissionGroupList()[index];
        let _group = await PermissionGroup.getPermissionGroup(generalGroup.groupId)
        _permissionGroups.push(_group.getAsJson())
    }


    res.setHeader("Content-Type", "application/json");
    res.json(_permissionGroups)
    res.status(200);
    res.send("ok");

}

export const createNewGroup = async (req: Request, res: Response) => {
    await PermissionGroup.createNewPermissionGroup("new group")

    res.status(200);
    res.send("ok");
}

export const deleteGroup = async (req: Request, res: Response) => {
    const {targetGroup} = req.body;
    if (!targetGroup) {
        res.status(400).json("invalid request")
        return
    }
    
    PermissionGroup.removePermissionGroup(targetGroup)

    res.status(200);
    res.send("ok");
}

export const addPermission = async (req: Request, res: Response) => {
    const {targetGroup,newPermission} = req.body;
    if (!targetGroup || !newPermission) {
        res.status(400).json("invalid request")
        return
    }

    const permissionGroup = await PermissionGroup.getPermissionGroup(targetGroup)
    await permissionGroup.addPermission(newPermission)

    res.status(200);
    res.send("ok");
}

export const deletePermission = async (req: Request, res: Response) => {
    const {targetGroup,permission} = req.body;
    if (!targetGroup || !permission) {
        res.status(400).json("invalid request")
        return
    }

    const permissionGroup = await PermissionGroup.getPermissionGroup(targetGroup)
    await permissionGroup.removePermission(permission)

    res.status(200);
    res.send("ok");
}