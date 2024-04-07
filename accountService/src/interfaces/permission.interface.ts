export type TPermission = {
    type: "topic" | "device" | "task" | "PermissionGroup" | "users"
    objectId: string | "all"
    read: boolean
    write: boolean
    delete: boolean
}

export type TPermissionsOptions = {
    action: "delete" | "modify" | "add"
    permission: TPermission
}