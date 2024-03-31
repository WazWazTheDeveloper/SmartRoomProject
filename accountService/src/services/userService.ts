import { v4 as uuidv4 } from 'uuid';
import { User } from '../modules/user';
import * as database from './mongoDBService'
import bcrypt from 'bcrypt';
import { TUser } from '../interfaces/user.interface';

type UserResult =
    | {
        isSuccessful: false;
        reason: string;
    }
    | {
        isSuccessful: true;
        user: User;
    };

export async function createNewUser(username: string, password: string): Promise<UserResult> {
    let userResult: UserResult = {
        isSuccessful: false,
        reason: ''
    }

    // check if user exist
    let userArr: User[] = []
    try {
        const fillter = { username: username };
        userArr = await database.getDocuments<TUser>(
            "users",
            fillter
        );
    } catch (err) {
        userResult = {
            isSuccessful: false,
            reason: 'internal server error'
        }
        return userResult
    }

    if(userArr.length >= 1) {
        userResult = {
            isSuccessful: false,
            reason: 'account already exists'
        }
        return (userResult)
    }

    const saltRounds = 10;
    let hashedPassword: string = await bcrypt.hash(password, saltRounds);

    const _id = uuidv4();
    const user = User.createNewUser(_id, username, hashedPassword);

    const isSuccessful = await database.createDocument('users', user);
    if (!isSuccessful) {
        return userResult
    }

    userResult = {
        isSuccessful: true,
        user: user
    }

    return userResult

}

// IMPLEMENT
export async function updateUserPassword(username: string, newPassword: string) {
    
}

// IMPLEMENT
export async function updateUserPermissions(username: string) {
    
}

// IMPLEMENT
export async function updateUserPermissionGroups(username: string) {
    
}
