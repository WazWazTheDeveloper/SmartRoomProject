import express, { NextFunction, Request, Response } from "express"
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
        // TODO: add type to decoded of somting
        (err: Error, decoded: any) => {
            if (err) {
                res.status(403).json({ message: 'Forbidden' })
                return
            }
            (req as any).user = decoded.userInfo.username;
            (req as any).roles = decoded.userInfo.permission;
            next()
        }
    )
}

export { verifyJWT }