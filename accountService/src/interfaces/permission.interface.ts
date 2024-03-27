export type TPermission = {
    type: "topic" | "device" | "task" | "PermissionGroup" | "users"
    objectId: string
    read: boolean
    write: boolean
    delete: boolean
}