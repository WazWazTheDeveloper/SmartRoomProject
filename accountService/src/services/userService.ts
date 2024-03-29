import { v4 as uuidv4 } from 'uuid';
import { User } from '../modules/user';
import * as database from './mongoDBService'

type UserResult =
    | {
        isSuccessful: false;
    }
    | {
        isSuccessful: true;
        user: User;
    };

export async function createNewUser(username:string,password:string):Promise<UserResult> {
    let userResult : UserResult = {
        isSuccessful : false
    }
    const _id = uuidv4();
    const user = User.createNewUser(_id,username,password);

    
    
    const isSuccessful = await database.createDocument('users',user);
    if(!isSuccessful) {
        return userResult    
    }

    userResult = {
        isSuccessful: true,
        user: user
    }

    return userResult    

}