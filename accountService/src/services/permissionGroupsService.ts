import { PermissionGroup } from "../modules/permissionGroup";

// IMPLEMENT
type PermissionGroupResult =
    | {
        isSuccessful: false;
        reason: string;
    }
    | {
        isSuccessful: true;
        user: PermissionGroup;
    };
export async function createNewGroup(groupName:string) {
    let userResult: PermissionGroupResult = {
        isSuccessful: false,
        reason: ''
    }
}
// IMPLEMENT
export async function updateGroupPermission() {
    
}