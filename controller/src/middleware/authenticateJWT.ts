import express, { NextFunction, Request, Response } from "express"
import jwt, { VerifyErrors } from 'jsonwebtoken';
import { problemDetails } from "../modules/problemDetails";

type JWTData = {
    userdata: {
        username: string
        userID: string
    }
}

/**
 * A middle ware thats verifies the request based on the JWT token attached to incoming request
 */
export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization || req.headers.Authorization

    if (typeof authHeader !== 'string') {
        return res.status(401).json(problemDetails({
            type: "about:blank",
            instance: req.originalUrl,
            title: "Unauthorized",
            details: "Authorization header missing or incorrectly formatted. Please include a Bearer token in the Authorization header.",
        }))
    }

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json(problemDetails({
            type: "about:blank",
            instance: req.originalUrl,
            title: "Unauthorized",
            details: "Authorization header incorrectly formatted.",
        }))
    }

    const token = authHeader.split(' ')[1]
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string,
        (err: VerifyErrors | null, decoded: any) => {
            const paylaod = decoded as JWTData

            if (err) {
                res.status(403).json(problemDetails({
                    type: "about:blank",
                    instance: req.originalUrl,
                    title: "Forbidden",
                    details: "Access token verification failed. Please ensure that you have a valid access token and try again.",
                }))
                return
            }

            req._userName = paylaod.userdata.username;
            req._userID = paylaod.userdata.userID;

            next()
        }
    )
}