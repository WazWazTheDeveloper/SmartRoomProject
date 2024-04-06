import { Request, Response } from "express"
import * as userService from '../../services/userService'
import { problemDetails } from "../../modules/problemDetails";
export async function createNewUser(req: Request, res: Response) {
    const {username,password} = req.body;
    if(typeof username != 'string' || typeof password != 'string') {
        return res.status(400).json(problemDetails({
            type : "about:blank",
            title:"Bad Request",
            details: "Invalid data provided. Please ensure that both username and password are strings.",
            instance: req.originalUrl,
        }))
    }

    let result = await userService.createNewUser(username,password);
    
    if(!result.isSuccessful) {
        return res.status(500).json(problemDetails({
            type : "about:blank",
            title:"Bad Request",
            details: `An unexpected error occurred while processing your request. Please try again later. ${result.reason}`,
            instance: req.originalUrl,
        }))
    }
    
    res.status(200).json("ok")
    return
}

// IMPLEMENT
export async function deleteUser(req: Request, res: Response) {
    
}