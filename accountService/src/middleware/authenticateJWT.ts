import express, { NextFunction, Request, Response } from "express"
import jwt, { VerifyErrors } from 'jsonwebtoken';

type JWTData = {
    userdata: {
        username: string
        userID : string
    }
}

/**
 * A middle ware thats verifies the request based on the JWT token attached to incoming request
 */
export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
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
        process.env.ACCESS_TOKEN_SECRET as string,
        (err: VerifyErrors | null, decoded: any) => {
            const paylaod = decoded as JWTData

            if (err) {
                res.status(403).json({ message: 'Forbidden' })
                return
            }

            req._userName = paylaod.userdata.username;
            req._userID = paylaod.userdata.userID;

            next()
        }
    )
}