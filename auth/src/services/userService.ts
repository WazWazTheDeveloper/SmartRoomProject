import { v4 as uuidv4 } from 'uuid';
import { User } from '../modules/user';

export function createNewUser(username:string,password:string) {
    const _id = uuidv4();
    const user = User.createNewUser(_id,username,password);

    //put into db
}