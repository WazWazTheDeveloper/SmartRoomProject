import { TPermission } from "../interfaces/permission.interface";
import { TPermissionGroup } from "../interfaces/permissionGroup.interface";

export class PermissionGroup implements TPermissionGroup {
    _id: string;
    groupDescription: string;
    groupName: string;
    permissions: TPermission[];
    constructor(
        _id: string,
        groupDescription: string,
        groupName: string,
        permissions: TPermission[]
    ) {
        this._id = _id;
        this.groupDescription = groupDescription;
        this.groupName = groupName;
        this.permissions = permissions;
    }
}