import { TPermission } from "./permission.interface"

export type TUser = {
    _id: string
    username: string
    password: string
    permissions: TPermission[]
    permissionGroups: string[]
    isAdmin: boolean
    isActive: boolean
    lastActiveDate: number
    creationDate: number
    settings: TUserSettings
}

export type TUserSettings = {
    isDarkmode: boolean
}