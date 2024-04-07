import { TPermissionsOptions } from "../interfaces/permission.interface";

/**
 * check if permissionOptions[] is of TPermissionsOptions Type
 * @param permissionOptions 
 * @returns true is of type permissionOptions[] else false
 */
export function isPermissionsOptions(permissionOptions: TPermissionsOptions[]) {
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