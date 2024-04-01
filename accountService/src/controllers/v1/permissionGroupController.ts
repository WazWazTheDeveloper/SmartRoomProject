import { Request, Response } from "express"
import * as permissionGroupsService from '../../services/permissionGroupsService'
export async function createNewGroup(req: Request, res: Response) {
    const {groupName,groupDescription} = req.body;
    if(typeof groupName != 'string' || typeof groupDescription != 'string') {
        res.status(400).json('Bad request')
        return
    }

    let result = await permissionGroupsService.createNewGroup(groupName,groupDescription);
    
    if(result.isSuccessful) {
        res.status(200).json("ok")
        return
    }
    else {
        res.status(500).json("Internal Server Error")
        return
    }
}