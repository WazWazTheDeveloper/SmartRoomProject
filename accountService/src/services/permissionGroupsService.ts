import { TPermissionGroup } from "../interfaces/permissionGroup.interface";
import { v4 as uuidv4 } from 'uuid';
import * as database from './mongoDBService'
import { loggerGeneral } from "./loggerService";
import { getRequestUUID } from "../middleware/requestID";

type PermissionGroupResult =
    | {
        isSuccessful: false;
    }
    | {
        isSuccessful: true;
        permissionGroup: TPermissionGroup;
    };
export async function createNewGroup(groupName:string,groupDescription:string) {
    let userResult: PermissionGroupResult = {
        isSuccessful: false,
    }
    const _id = uuidv4();
    const permissionGroup: TPermissionGroup= {
        _id:_id,
        groupName:groupName,
        groupDescription:groupDescription,
        permissions:[]
    }
    try {
        const insertResult =  await database.createDocument("permissionGroups",permissionGroup);
        if(insertResult) {
            userResult = {
                isSuccessful: true,
                permissionGroup:permissionGroup
            }
        }
        loggerGeneral.info(`creted new permission group:"${groupName}" with id:"${_id}"`,{uuid:getRequestUUID()})
    }catch (e) {
        loggerGeneral.info(`error in permission group creation: ${e}`,{uuid:getRequestUUID()})
    }

    return userResult
}

// IMPLEMENT
export async function updateGroupPermission() {
    
}