import { getTime } from "date-fns";
import { TPermission } from "../interfaces/permission.interface";
import { TUser } from "../interfaces/user.interface";

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
    ){
        this._id = _id;
        this.username = username;
        this.password = password;
        this.permissions = permissions;
        this.permissionGroups = permissionGroups;
        this.isAdmin = isAdmin;
        this.isActive = isActive;
        this.lastActiveDate = lastActiveDate;
        this.creationDate = creationDate;
    }

    static createNewUser(_id:string,username:string, password:string) {
        const curTime = getTime(new Date());
        const newUser = new User(_id,username,password,[],[],false,true,curTime,curTime);
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
            userDB.creationDate
        )

        return user;
    }
}