import { TPermissionGroup } from "../interfaces/permissionGroup.interface";
import { v4 as uuidv4 } from 'uuid';
import * as database from './mongoDBService'
import { loggerGeneral } from "./loggerService";
import { getRequestUUID } from "../middleware/requestID";
import * as mongoDB from "mongodb";
import { isPermissionsOptions } from "../modules/permissionOptions";
import { TPermissionsOptions } from "../interfaces/permission.interface";

type PermissionGroupResult =
    | {
        isSuccessful: false;
    }
    | {
        isSuccessful: true;
        permissionGroup: TPermissionGroup;
    };
/**
 * create new permission group
 * @param groupName Group name
 * @param groupDescription Group description
 * @returns PermissionGroupResult promiss object with result
 */
export async function createNewGroup(groupName: string, groupDescription: string) {
    let userResult: PermissionGroupResult = {
        isSuccessful: false,
    }
    const _id = uuidv4();
    const permissionGroup: TPermissionGroup = {
        _id: _id,
        groupName: groupName,
        groupDescription: groupDescription,
        permissions: []
    }
    try {
        const insertResult = await database.createDocument("permissionGroups", permissionGroup);
        if (insertResult) {
            userResult = {
                isSuccessful: true,
                permissionGroup: permissionGroup
            }
        }
        loggerGeneral.info(`creted new permission group:"${groupName}" with id:"${_id}"`, { uuid: getRequestUUID() })
    } catch (e) {
        loggerGeneral.info(`error in permission group creation: ${e}`, { uuid: getRequestUUID() })
    }

    return userResult
}

/**
 * updates group permissions
 * @param userID ID of group to update
 * @param permissionOptions TPermissionsOptions Object array that specify how to check user permissions
 * @returns true is done seccsesfuly else false
 */
export async function updateGroupPermission(groupID: string, permissionOptions: TPermissionsOptions[]) {
    const updateList: mongoDB.AnyBulkWriteOperation<TPermissionGroup>[] = [];

    if (!isPermissionsOptions(permissionOptions)) {
        throw new Error("invalid type of permissionOptions")
    }

    for (let index = 0; index < permissionOptions.length; index++) {
        const permissionOption = permissionOptions[index];
        switch (permissionOption.action) {
            case 'add': {
                updateList.push({
                    updateOne: {
                        filter: { _id: groupID },
                        update: {
                            $push: {
                                permissions: {
                                    type: permissionOption.permission.type,
                                    objectId: permissionOption.permission.objectId,
                                    write: permissionOption.permission.write,
                                    read: permissionOption.permission.read,
                                    delete: permissionOption.permission.delete
                                }
                            }
                        }
                    }
                })
                break;
            }
            case 'delete': {
                updateList.push({
                    updateOne: {
                        filter: { _id: groupID },
                        update: {
                            $pull: {
                                permissions: {
                                    type: permissionOption.permission.type,
                                    objectId: permissionOption.permission.objectId,
                                }
                            }
                        }
                    }
                })
                break;
            }
            case 'modify': {
                updateList.push({
                    updateOne: {
                        filter: {
                            _id: groupID,
                            "permissions.objectId": permissionOption.permission.objectId
                        },
                        update: {
                            $set: {
                                "permissions.$.write": permissionOption.permission.write,
                                "permissions.$.read": permissionOption.permission.read,
                                "permissions.$.delete": permissionOption.permission.delete
                            }
                        }
                    }
                })
                break;
            }
        }
    }

    try {
        const result = await database.bulkWriteCollection('permissionGroups', updateList)
        if (result) {
            return true

        }
        else {
            loggerGeneral.error(`failed to update user permission to group: ${groupID}`, { uuid: getRequestUUID() })
            return false
        }
    } catch (e) {
        loggerGeneral.error(`failed to update groupPermission: ${e}`, { uuid: getRequestUUID() })
        return false
    }
}