import { getTime } from "date-fns";
import { TUser } from "../interfaces/user.interface";

export class User implements TUser {
    _id: string
    username: string
    password: string
    isActive: boolean
    lastActiveDate: number
    isAdmin: boolean


    constructor(
        _id: string,
        username: string,
        password: string,
        isActive: boolean,
        lastActiveDate: number,
        isAdmin: boolean
    ) {
        this._id = _id;
        this.username = username;
        this.password = password;
        this.isActive = isActive;
        this.lastActiveDate = lastActiveDate;
        this.isAdmin = isAdmin
    }

    static getUserFromDB(userDB: TUser) {
        const user = new User(
            userDB._id,
            userDB.username,
            userDB.password,
            userDB.isActive,
            userDB.lastActiveDate,
            userDB.isAdmin,
        )

        return user;
    }
}