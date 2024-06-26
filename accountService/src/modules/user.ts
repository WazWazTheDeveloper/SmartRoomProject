import { getTime } from "date-fns";
import { TUser, TUserSettings } from "../interfaces/user.interface";
import { TPermission } from "../interfaces/permission.interface";

export class User implements TUser {
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

    static readonly defaultUserSettings: TUserSettings = {
        isDarkmode: false,
        favoriteDevices: []
    }


    constructor(
        _id: string,
        username: string,
        password: string,
        permissions: TPermission[],
        permissionGroups: string[],
        isAdmin: boolean,
        isActive: boolean,
        lastActiveDate: number,
        creationDate: number,
        settings: TUserSettings
    ) {
        this._id = _id;
        this.username = username;
        this.password = password;
        this.permissions = permissions;
        this.permissionGroups = permissionGroups;
        this.isAdmin = isAdmin;
        this.isActive = isActive;
        this.lastActiveDate = lastActiveDate;
        this.creationDate = creationDate;
        this.settings = settings;
    }

    static createNewUser(_id: string, username: string, password: string, isAdmin: boolean = false) {
        const curTime = getTime(new Date());
        const defaultPermissions: TPermission[] = [
            {
                type: "users",
                objectId: _id,
                read: true,
                delete: false,
                write: true
            }
        ]
        const newUser = new User(_id, username, password, defaultPermissions, [], isAdmin, true, curTime, curTime, this.defaultUserSettings);
        return newUser;
    }

    static getUserFromDB(userDB: TUser) {
        const user = new User(
            userDB._id,
            userDB.username,
            userDB.password,
            userDB.permissions,
            userDB.permissionGroups,
            userDB.isAdmin,
            userDB.isActive,
            userDB.lastActiveDate,
            userDB.creationDate,
            userDB.settings
        )

        return user;
    }
}