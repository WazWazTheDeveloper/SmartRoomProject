import { Request, Response } from "express"
import * as userService from '../../services/userService'
export async function createNewUser(req: Request, res: Response) {
    const {username,password} = req.body;
    if(typeof username != 'string' || typeof password != 'string') {
        res.status(400).json('Bad request')
        return
    }

    let result = await userService.createNewUser(username,password);
    
    if(result.isSuccessful) {
        res.status(200).json("ok")
        return
    }
    else {
        res.status(500).json(result.reason)
        return
    }
}

// IMPLEMENT
export async function deleteUser(req: Request, res: Response) {
    
}