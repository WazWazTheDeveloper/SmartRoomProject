import { v4 as uuidv4 } from 'uuid';
import { User } from '../modules/user';
import * as database from './mongoDBService'
import bcrypt from 'bcrypt';
import { TUser } from '../interfaces/user.interface';
import { loggerGeneral } from './loggerService';
import { getRequestUUID } from '../middleware/requestID';
import { TPermission, TPermissionMaybe } from '../interfaces/permission.interface';
import * as mongoDB from "mongodb";

type UserResult =
    | {
        isSuccessful: false;
        reason: string;
    }
    | {
        isSuccessful: true;
        user: User;
    };

export async function createNewUser(username: string, password: string): Promise<UserResult> {
    let userResult: UserResult = {
        isSuccessful: false,
        reason: ''
    }

    // check if user exist
    let userArr: User[] = []
    try {
        const fillter = { username: username };
        userArr = await database.getDocuments<TUser>(
            "users",
            fillter
        );
    } catch (err) {
        userResult = {
            isSuccessful: false,
            reason: 'internal server error'
        }
        return userResult
    }

    if (userArr.length >= 1) {
        userResult = {
            isSuccessful: false,
            reason: 'account already exists'
        }
        return (userResult)
    }

    const saltRounds = 10;
    let hashedPassword: string = await bcrypt.hash(password, saltRounds);

    const _id = uuidv4();
    const user = User.createNewUser(_id, username, hashedPassword);

    try {
        const isSuccessful = await database.createDocument('users', user);
        if (isSuccessful) {
            loggerGeneral.info(`creted new user:"${username}"`, { uuid: getRequestUUID() })
            userResult = {
                isSuccessful: true,
                user: user
            }
            return userResult
        }
        loggerGeneral.error(`failed to create new user unknow error`, { uuid: getRequestUUID() })

        return userResult
    } catch (e) {
        loggerGeneral.error(`failed to create new user: ${e}`, { uuid: getRequestUUID() })
        return userResult
    }
}

export async function updateUserPassword(username: string, newPassword: string) {
    const saltRounds = 10;
    let newHashedPassword: string = await bcrypt.hash(newPassword, saltRounds);

    const filter = {
        username: username,
    }
    const updateFilter = {
        $set: { password: newHashedPassword }
    }
    try {
        const result = await database.updateDocument("users", filter, updateFilter);

        if (result) {
            return true;
        }
        else {
            loggerGeneral.error(`failed to update password to user: ${username}`, { uuid: getRequestUUID() })
            return false;
        }
    } catch (e) {
        loggerGeneral.error(`failed to update password: ${e}`, { uuid: getRequestUUID() })
        return false;
    }
}

// IMPLEMENT
type PermissionCheck = {
    type: "topic" | "device" | "task" | "PermissionGroup" | "users"
    objectId: string | "all"
    permission: "read" | "write" | "delete"
}
export async function checkUserPermission(userID: string, permissionToCheck: PermissionCheck) {
    const getPermissionFromUserAgregationPipeline = [
        {
            $match: {
                _id: userID,
            },
        },
        {
            $unwind: "$permissions",
        },
        {
            $match: {
                "permissions.objectId": permissionToCheck.objectId,
                "permissions.type": permissionToCheck.type,
            },
        },
        {
            $project: {
                permissions: 1,
                isAdmin: 1
            }
        }
    ]
    const getPermissionFromUserGroupsAgregationPipeline = [
        {
            $match: {
                _id: "4cea5241-8041-490c-9209-0e36561e8370",
            },
        },
        {
            $lookup: {
                from: "permissiongroups",
                localField: "permissionGroups",
                foreignField: "_id",
                as: "permissionFromGroups",
            },
        },
        {
            $unwind: {
                path: "$permissionFromGroups",
            },
        },
        {
            $unwind: {
                path: "$permissionFromGroups.permissions",
            },
        },
        {
            $group: {
                _id: "$_id",
                permissions: { $push: "test" }
            }
        }
    ]


    type TUserPermissionsSearchResult = { _id: string;isAdmin:boolean; permissions: TPermission }
    const userPermissions = await database.getDocumentsAggregate<TUserPermissionsSearchResult>('users', getPermissionFromUserAgregationPipeline);
    let isFound = false

    //check if admin and if so return true
    if (userPermissions.length > 0 && userPermissions[0].isAdmin === true) return true;

    for (let index = 0; index < userPermissions.length; index++) {
            const element = userPermissions[index];
        switch (permissionToCheck.permission) {
            case ("write"): {
                if (!element.permissions.write) return false;
                if (element.permissions.write) {
                    isFound = true
                }
            }
            case ("delete"): {
                if (!element.permissions.delete) return false;
                if (element.permissions.delete) {
                    isFound = true
                }
            }
            case ("read"): {
                if (!element.permissions.read) return false;
                if (element.permissions.read) {
                    isFound = true
                }
            }
        }
    }
    if (isFound) return true;
    const userGroupPermissions = await database.getDocumentsAggregate<TUserPermissionsSearchResult>('users', getPermissionFromUserGroupsAgregationPipeline);
    for (let index = 0; index < userGroupPermissions.length; index++) {
        const element = userGroupPermissions[index];
        switch (permissionToCheck.permission) {
            case ("write"): {
                if (!element.permissions.write) return false;
                if (element.permissions.write) {
                    isFound = true
                }
            }
            case ("delete"): {
                if (!element.permissions.delete) return false;
                if (element.permissions.delete) {
                    isFound = true
                }
            }
            case ("read"): {
                if (!element.permissions.read) return false;
                if (element.permissions.read) {
                    isFound = true
                }
            }
        }
    }
    if (isFound) return true;

    return false;
}

type TPermissionsOptions = {
    action: "delete" | "modify" | "add"
    permission: TPermission
}[]
export async function updateUserPermissions(userID: string, permissionOptions: TPermissionsOptions) {
    const updateList: mongoDB.AnyBulkWriteOperation<TUser>[] = [];

    if (!isPermissionsOptions(permissionOptions)) {
        throw new Error("invalid type of permissionOptions")
    }

    for (let index = 0; index < permissionOptions.length; index++) {
        const permissionOption = permissionOptions[index];
        switch (permissionOption.action) {
            case 'add': {
                updateList.push({
                    updateOne: {
                        filter: { _id: userID },
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
                        filter: { _id: userID },
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
                            _id: userID,
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
        const result = await database.bulkWriteCollection('users', updateList)
        if (result) {
            return true

        }
        else {
            loggerGeneral.error(`failed to update user permission to user: ${userID}`, { uuid: getRequestUUID() })
            return false
        }
    } catch (e) {
        loggerGeneral.error(`failed to update user permission: ${e}`, { uuid: getRequestUUID() })
        return false
    }
}

export function isPermissionsOptions(permissionOptions: TPermissionsOptions) {
    if (!Array.isArray(permissionOptions)) {
        return false
    }
    for (let index = 0; index < permissionOptions.length; index++) {
        const permissionOption = permissionOptions[index];
        if (
            typeof (permissionOption.action) !== 'boolean' ||
            typeof (permissionOption.permission) !== 'object' ||
            typeof (permissionOption.permission.objectId) !== 'string' ||
            typeof (permissionOption.permission.type) !== 'string' ||
            typeof (permissionOption.permission.write) !== 'boolean' ||
            typeof (permissionOption.permission.read) !== 'boolean' ||
            typeof (permissionOption.permission.delete) !== 'boolean'
        ) {
            return false
        }
    }

    return true
}

// IMPLEMENT
export async function updateUserPermissionGroups(username: string) {

}
