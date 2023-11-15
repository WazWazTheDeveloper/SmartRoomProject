import express, { NextFunction, Request, Response } from "express"
import { JWTData } from "../interfaces/JWT.interface";
var jwt = require('jsonwebtoken');

const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization || req.headers.Authorization

    if (typeof authHeader !== 'string') {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const token = authHeader.split(' ')[1]
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err: Error, decoded: JWTData) => {
            if (err) {
                res.status(403).json({ message: 'Forbidden' })
                return
            }
            req.username = decoded.userInfo.username;
            req.roles = decoded.userInfo.permission;
            req.isAdmin = decoded.userInfo.isAdmin;
            next()
        }
    )
}

export { verifyJWT }