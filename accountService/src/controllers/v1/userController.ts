import express, { Request, Response, NextFunction } from "express"
import * as userService from '../../services/userService'
import { problemDetails } from "../../modules/problemDetails";
import asyncHandler from "express-async-handler"
import { response401 } from "../../modules/errors/401";

export const createNewUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;
    if (typeof username != 'string' || typeof password != 'string') {
        res.status(400).json(problemDetails({
            type: "about:blank",
            title: "Bad Request",
            details: "Invalid data provided. Please ensure that both username and password are strings.",
            instance: req.originalUrl,
        }))
        return 
    }

    let result = await userService.createNewUser(username, password);

    if (result.isSuccessful) {
        res.status(200).json("ok")
    }
    
    next()
})

export const deleteUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) =>{
    //check permissions
    const isAuthorized = await userService.checkUserIsAdmin(req._userID)

    if (!isAuthorized) {
        response401(req,res);
        return 
    }

    const { userID } = req.body;
    if (typeof userID != 'string') {
        res.status(400).json(problemDetails({
            type: "about:blank",
            title: "Bad Request",
            details: "Invalid data provided. Please ensure that userID is string.",
            instance: req.originalUrl,
        }))
        return 
    }

    const result = await userService.deleteUser(userID);

    if (result) {
        res.status(200).json('ok')
    }

    next()
})