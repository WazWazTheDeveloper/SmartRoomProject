export type User = {
    _id: string
    username: string
    password: string
    permissions: Permission[]
    permissionGroups: string[]
    isAdmin: boolean
    isActive: boolean
    lastActiveDate: number
    creationDate: number
}

export type Permission = {
    type: "topic" | "device" | "task" | "PermissionGroup" | "users"
    objectId: string
    read: boolean
    write: boolean
    delete: boolean
}

export type PermissionGroup = {
    _id: string
    groupName: string
    groupDescription: string
    permissions: Permission[]
}