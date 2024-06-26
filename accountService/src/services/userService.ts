import { v4 as uuidv4 } from 'uuid';
import { User } from '../modules/user';
import * as database from './mongoDBService'
import bcrypt from 'bcrypt';
import { TFavoriteDevice, TUser, TUserSettings } from '../interfaces/user.interface';
import { loggerGeneral } from './loggerService';
import { getRequestUUID } from '../middleware/requestID';
import { TPermission, TPermissionsOptions } from '../interfaces/permission.interface';
import * as mongoDB from "mongodb";
import { isPermissionsOptions } from '../modules/permissionOptions';

type UserResult = {
    isSuccessful: false;
    reason: string;
} | {
    isSuccessful: true;
    user: User;
};

/**
 * creates new user
 * @param username username of the user to be created
 * @param password password of the user to be created
 * @returns UserResult promiss
 */
export async function createNewUser(username: string, password: string, isAdmin : boolean = false): Promise<UserResult> {
    let userResult: UserResult = {
        isSuccessful: false,
        reason: 'unknown'
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
    const user = User.createNewUser(_id, username, hashedPassword,isAdmin);

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

/**
 * delete user
 * @param userID UUID of user to be deleted
 * @returns true is delete seccsesfuly false if not
 */
export async function deleteUser(userID: string) {
    const filter = {
        _id: userID,
    }

    try {
        const result = await database.deleteDocument("users", filter);

        if (result) {
            return true;
        }
        else {
            loggerGeneral.error(`failed to delete user: ${userID}`, { uuid: getRequestUUID() })
            return false;
        }
    } catch (e) {
        loggerGeneral.error(`failed to delete user: ${e}`, { uuid: getRequestUUID() })
        return false;
    }
}

/**
 * change password for user
 * @param userID UUID of user
 * @param newPassword new password for the user
 * @returns true is changed seccsesfuly false if not
 */
export async function updateUserPassword(userID: string, newPassword: string) {
    const saltRounds = 10;
    let newHashedPassword: string = await bcrypt.hash(newPassword, saltRounds);

    const filter = {
        _id: userID,
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
            loggerGeneral.error(`failed to update password to user: ${userID}`, { uuid: getRequestUUID() })
            return false;
        }
    } catch (e) {
        loggerGeneral.error(`failed to update password: ${e}`, { uuid: getRequestUUID() })
        return false;
    }
}

type PermissionCheck = {
    type: "topic" | "device" | "task" | "permissionGroup" | "users"
    objectId: string | "all"
    permission: "read" | "write" | "delete"
}
/**
 * check if user have a specific permission
 * @param userID UUID of user to check
 * @param permissionToCheck PermissionCheck Object with specification for permission to check
 * @returns true if user has permission else false
 */
export async function checkUserPermission(userID: string, permissionToCheck: PermissionCheck) {
    type TUserPermissionsSearchResult = { _id: string; isAdmin: boolean; permissions: TPermission }

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
            }
        }
    ]
    const getPermissionFromUserGroupsAgregationPipeline = [
        {
            $match: {
                _id: userID,
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
                permissions: { $push: "$permissionFromGroups.permissions" }
            }
        }
    ]
    const getIsAdminAgregationPipeline = [
        {
            $match: {
                _id: userID,
            },
        },
        {
            $project: {
                isAdmin: 1
            }
        }
    ]

    try {
        const userIsAdmin = await database.getDocumentsAggregate<TUserPermissionsSearchResult>('users', getIsAdminAgregationPipeline);

        if (userIsAdmin.length > 0 && userIsAdmin[0].isAdmin === true) return true;
        const userPermissions = await database.getDocumentsAggregate<TUserPermissionsSearchResult>('users', getPermissionFromUserAgregationPipeline);
        let isFound = false

        //check if admin and if so return true

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

    } catch (e) {
        throw new Error(String(e))
    }
}

/**
 * check if user have admin permission
 * @param userID UUID of user to check
 * @returns true if user has permission else false
 */
export async function checkUserIsAdmin(userID: string) {
    type TUserPermissionsSearchResult = { _id: string; isAdmin: boolean; }
    const getIsAdminAgregationPipeline = [
        {
            $match: {
                _id: userID,
            },
        },
        {
            $project: {
                isAdmin: 1
            }
        }
    ]
    const userIsAdmin = await database.getDocumentsAggregate<TUserPermissionsSearchResult>('users', getIsAdminAgregationPipeline);

    if (userIsAdmin.length > 0 && userIsAdmin[0].isAdmin === true) return true;

    return false;
}

/**
 * updates user permissions
 * @param userID UUID of user to check
 * @param permissionOptions TPermissionsOptions Object array that specify how to check user permissions
 * @returns true is done seccsesfuly else false
 */
export async function updateUserPermissions(userID: string, permissionOptions: TPermissionsOptions[]) {
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

/**
 * get all permissions of user
 * @param userID UUID of user
 * @returns TResult with result from quarry
 */
type TUserPermissionsSearchResult = { _id: string; isAdmin: boolean; permissions: TPermission[] }
type TResult = {
    isSuccessful: false,
    errorCode: number
    error: string
} | {
    isSuccessful: true,
    permissions: TUserPermissionsSearchResult
}
/**
 * get permission of specified user
 * @param userID UUID of user
 * @returns TResult
 * 0: db error, 1: no user found
 */
export async function getUserPermissions(userID: string): Promise<TResult> {
    let result: TResult


    const getPermissionFromUserAgregationPipeline = [
        {
            $match: {
                _id: userID,
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
                _id: userID,
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
                permissions: { $push: "$permissionFromGroups.permissions" }
            }
        }
    ]

    try {
        const userPermissions = await database.getDocumentsAggregate<TUserPermissionsSearchResult>('users', getPermissionFromUserAgregationPipeline);
        const permissionsFromGroups = await database.getDocumentsAggregate<TUserPermissionsSearchResult>('users', getPermissionFromUserGroupsAgregationPipeline);
        if (userPermissions.length === 0) {
            result = {
                isSuccessful: false,
                errorCode: 1,
                error: "no such user"
            }
            return result
        }

        if (permissionsFromGroups.length != 0) {
            userPermissions[0].permissions = userPermissions[0].permissions.concat(permissionsFromGroups[0].permissions)
        }

        result = {
            isSuccessful: true,
            permissions: userPermissions[0]
        }
        return result;
    } catch (e) {
        result = {
            isSuccessful: false,
            errorCode: 0,
            error: String(e)
        }
        return result;
    }
}

export async function getUserPermissionsOfType(userID: string, permissionType: string): Promise<TResult> {
    let result: TResult


    const getPermissionFromUserAgregationPipeline = [
        {
            $match: {
                _id: userID,
            },
        },
        {
            $unwind: {
                path: "$permissions"
            }
        },
        {
            $match: {
                "permissions.type": permissionType
            }
        },
        {
            $group: {
                _id: "$_id",
                permissions: { $push: "$permissions" },
                isAdmin: { $first: "$isAdmin" }
            }
        }
    ]

    const getPermissionFromUserGroupsAgregationPipeline = [
        {
            $match: {
                _id: userID,
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
            $match: {
                "permissionFromGroups.permissions.type": permissionType
            }
        },
        {
            $group: {
                _id: "$_id",
                permissions: { $push: "$permissionFromGroups.permissions" },
            }
        }
    ]

    try {
        const userPermissions = await database.getDocumentsAggregate<TUserPermissionsSearchResult>('users', getPermissionFromUserAgregationPipeline);
        const permissionsFromGroups = await database.getDocumentsAggregate<TUserPermissionsSearchResult>('users', getPermissionFromUserGroupsAgregationPipeline);
        // BUG: when user doesn't have any permissions(of type) will return user not found
        if (userPermissions.length === 0) {
            result = {
                isSuccessful: false,
                errorCode: 1,
                error: "no such user"
            }
            return result
        }

        if (permissionsFromGroups.length != 0) {
            userPermissions[0].permissions = userPermissions[0].permissions.concat(permissionsFromGroups[0].permissions)
        }

        result = {
            isSuccessful: true,
            permissions: userPermissions[0]
        }
        return result;
    } catch (e) {
        result = {
            isSuccessful: false,
            errorCode: 0,
            error: String(e)
        }
        return result;
    }
}

type TPermissionGroupOptions = {
    action: "delete" | "add"
    groupID: string
}
export async function updateUserPermissionGroups(userID: string, options: TPermissionGroupOptions[]) {
    const updateList: mongoDB.AnyBulkWriteOperation<TUser>[] = [];

    // TODO: chcek if valid groupID

    for (let index = 0; index < options.length; index++) {
        const element = options[index];
        switch (element.action) {
            case ("add"): {
                updateList.push({
                    updateOne: {
                        filter: {
                            _id: userID,
                        },
                        update: {
                            $push: {
                                permissionGroups: element.groupID
                            }
                        }
                    }
                })
                break;
            }
            case ("delete"): {
                updateList.push({
                    updateOne: {
                        filter: {
                            _id: userID,
                        },
                        update: {
                            $pull: {
                                permissionGroups: element.groupID
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
            loggerGeneral.error(`failed to update user permission groups to user: ${userID}`, { uuid: getRequestUUID() })
            return false
        }
    } catch (e) {
        loggerGeneral.error(`failed to update user permission groups: ${e}`, { uuid: getRequestUUID() })
        return false
    }
}

export function isPermissionGroupOptions(permissionOptions: TPermissionGroupOptions[]) {
    if (!Array.isArray(permissionOptions)) {
        return false
    }
    for (let index = 0; index < permissionOptions.length; index++) {
        const permissionOption = permissionOptions[index];
        if (
            typeof (permissionOption.action) !== 'string' ||
            typeof (permissionOption.groupID) !== 'string'
        ) {
            return false
        }
    }

    return true
}

export async function updateUserDarkMode(userID: string, isDarkmode: boolean) {
    const filter = {
        _id: userID,
    }
    const updateFilter = {
        $set: { 'settings.isDarkmode': isDarkmode }
    }

    try {
        return await database.updateDocument('users', filter, updateFilter)
    } catch (e) {
        throw new Error(e as string);
    }
}

type TSettingResult = {
    isSuccessful: false;
} | {
    isSuccessful: true;
    userSettings: TUserSettings;
};

export async function getUserSettings(userID: string) {
    let result: TSettingResult = { isSuccessful: false }
    const getUserSettingsAgregationPipeline = [
        {
            $match: {
                _id: userID,
            },
        },
        {
            $project: {
                settings: 1
            }
        }
    ]

    try {
        const userSettingsResult = await database.getDocumentsAggregate<TUser>('users', getUserSettingsAgregationPipeline);
        if (!userSettingsResult[0]) return result

        result = {
            isSuccessful: true,
            userSettings: userSettingsResult[0].settings
        }

        return result


    } catch (e) {
        throw new Error(e as string)
    }
}

export async function updateUserFavoriteDevices(userID: string, newFavoriteDevices: TFavoriteDevice[]) {
    const isValidTFavoriteDevices = checkValidTFavoriteDevice(newFavoriteDevices);
    if (!isValidTFavoriteDevices) {
        throw new Error("invalid newFacoriteDevice type")
    }

    for (let i = 0; i < newFavoriteDevices.length; i++) {
        let hasI = false
        for (let j = 0; j < newFavoriteDevices.length; j++) {
            const place = newFavoriteDevices[j].place
            if (place == i) {
                hasI = true
            }
        }
        if (!hasI) {
            throw new Error(`Missing favorite device with place ${i}`)
        }
    }


    try {
        const filter = {
            _id: userID,
        }
        const updateFilter = {
            $set: { 'settings.favoriteDevices': newFavoriteDevices }
        }
        return await database.updateDocument('users', filter, updateFilter)
    } catch (e) {
        throw new Error(e as string)
    }
}

export function checkValidTFavoriteDevice(newFavoriteDevices: TFavoriteDevice[]) {
    for (let index = 0; index < newFavoriteDevices.length; index++) {
        const element = newFavoriteDevices[index];
        if (typeof (element.deviceID) != "string") return false;
        if (typeof (element.place) != "number") return false;
    }
    return true
}

export async function addUserFavoriteDevice(userID: string, newFavoriteDeviceID: string) {
    // TODO: check if device exit

    const getUserFavoriteDevicesArrayLenthAgregation = [
        {
            $match:
            {
                _id: userID
            }
        },
        {
            $unwind:
            {
                path: "$settings.favoriteDevices"
            }
        },
        {
            $count:
                "count"
        }
    ]

    const getUser = [
        {
            $match:
            {
                _id: userID
            }
        },
        {
            $unwind:
            {
                path: "$settings.favoriteDevices"
            }
        },
        {
            $count:
                "count"
        }
    ]
    type TCount = {
        count: number
    }
    const user = await database.getDocuments<User>('users',{_id: userID})
    const userFavoriteLenthResult: TCount[] = await database.getDocumentsAggregate<TCount>('users', getUserFavoriteDevicesArrayLenthAgregation);
    if (user.length == 0) {
        throw new Error("no user found")
    }
    console.log(userFavoriteLenthResult)

    let count = 0
    if(userFavoriteLenthResult.length != 0) {
        count = userFavoriteLenthResult[0].count
    }

    const newFacoriteDeviceItem: TFavoriteDevice = {
        deviceID: newFavoriteDeviceID,
        place: count
    }

    const updateOne = [{
        updateOne: {
            filter: { _id: userID },
            update: {
                $push: {
                    "settings.favoriteDevices": newFacoriteDeviceItem
                }
            }
        }
    }]

    try {
        const result = await database.bulkWriteCollection('users', updateOne)
        return result
    } catch (e) {
        loggerGeneral.error(`addUserFavoriteDevice: ${e}`, { uuid: getRequestUUID() })
        throw new Error(e as string)
    }
}

export async function deleteUserFavoriteDevice(userID: string, favoriteDeviceID: string, devicePlace: number) {
    const getUserFavoriteDevicesArrayLenthAgregation = [
        {
            $match:
            {
                _id: userID
            }
        },
        {
            $unwind:
            {
                path: "$settings.favoriteDevices"
            }
        },
        {
            $count:
                "count"
        }
    ]
    type TCount = {
        count: number
    }
    const userFavoriteLengthResult: TCount[] = await database.getDocumentsAggregate<TCount>('users', getUserFavoriteDevicesArrayLenthAgregation);
    if (userFavoriteLengthResult.length == 0) {
        throw new Error("no user found")
    }

    const updateList = []

    updateList.push({
        updateOne: {
            filter: { _id: userID },
            update: {
                $pull: {
                    "settings.favoriteDevices": {
                        deviceID: favoriteDeviceID,
                        place: devicePlace
                    }
                }
            }
        }
    })

    for (let i = devicePlace + 1; i < userFavoriteLengthResult[0].count; i++) {
        updateList.push({
            updateOne: {
                filter: {
                    _id: userID,
                    "settings.favoriteDevices.place": i
                },
                update: {
                    $set : {
                        "settings.favoriteDevices.$.place": i-1
                    }
                }
            }
        })
    }

    try {
        const result = await database.bulkWriteCollection('users', updateList)
        if (result) {
            return true
        }
        else {
            loggerGeneral.error(`failed to update user permission groups to user: ${userID}`, { uuid: getRequestUUID() })
            return false
        }
    } catch (e) {
        loggerGeneral.error(`deleteUserFavoriteDevice: ${e}`, { uuid: getRequestUUID() })
        throw new Error(e as string)
    }
}