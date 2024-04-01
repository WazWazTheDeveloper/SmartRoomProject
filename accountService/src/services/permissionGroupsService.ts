import { TPermissionGroup } from "../interfaces/permissionGroup.interface";
import { v4 as uuidv4 } from 'uuid';
import * as database from './mongoDBService'

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
    const insertResult =  await database.createDocument("permissionGroups",permissionGroup);
    if(insertResult) {
        userResult = {
            isSuccessful: true,
            permissionGroup:permissionGroup
        }
    }

    return userResult
}

// IMPLEMENT
export async function updateGroupPermission() {
    
}