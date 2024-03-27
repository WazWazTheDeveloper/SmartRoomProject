import { TPermission } from "./permission.interface"
export type TPermissionGroup = {
    _id: string
    groupName: string
    groupDescription: string
    permissions: TPermission[]
}