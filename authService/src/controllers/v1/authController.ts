import express, { Request, Response, NextFunction } from "express"
import { User } from "../../modules/user";
import { getDocuments } from "../../services/mongoDBService";
import { TUser } from "../../interfaces/user.interface";
import bcrypt from 'bcrypt';
import jwt, { VerifyErrors } from 'jsonwebtoken';
import { updateLastActive } from "../../services/userService";
import { loggerGeneral } from "../../services/loggerService";
import { getRequestUUID } from "../../middleware/requestID";
import asyncHandler from "express-async-handler"
import { problemDetails } from "../../modules/problemDetails";
import { response500 } from "../../modules/errors/500";

type JWTData = {
    userdata: {
        username: string
        userID: string
        isAdmin: boolean
    }
}
export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;
    // check that all field exist
    // TODO: add type checking
    if (!username || !password) {
        res.status(400).json(problemDetails({
            type: "about:blank",
            title: "Bad Request",
            details: "All fields are required.",
            instance: req.originalUrl,
        }))
        return
    }

    // get all user with username
    let userArr: User[] = []
    try {
        const fillter = { username: username };
        userArr = await getDocuments<TUser>(
            "users",
            fillter
        );
    } catch (err) {
        res.status(500).json(problemDetails({
            type: "about:blank",
            title: "Internal server error",
            details: `Failed to authenticated user: ${username} due to internal server error`,
            instance: req.originalUrl,
        }))
        loggerGeneral.error(`failed to authenticated user: ${username} dua to internal server error`, { uuid: getRequestUUID() })
        return
    }

    // check that account exist
    if (userArr.length == 0) {
        res.status(400).json(problemDetails({
            type: "about:blank",
            title: "Bad Request",
            details: "Bad username or password",
            instance: req.originalUrl,
        }))
        return
    }

    // check that only one use exist with said user name
    if (userArr.length != 1) {
        res.status(500).json(problemDetails({
            type: "about:blank",
            title: "Internal server error",
            details: `Failed to authenticate user '${username}' due to the presence of multiple users with the same username.`,
            instance: req.originalUrl,
        }))
        loggerGeneral.error(`Failed to authenticate user '${username}' due to the presence of multiple users with the same username.`, { uuid: getRequestUUID() })
        return
    }

    const user = userArr[0]

    // check if account is active
    if (!user.isActive) {
        res.status(403).json(problemDetails({
            type: "about:blank",
            title: "Account disabled",
            details: `Account disabled`,
            instance: req.originalUrl,
        }))
        return
    }

    // check password
    const response = await bcrypt.compare(password, user.password)
    if (!response) {
        res.status(400).json(problemDetails({
            type: "about:blank",
            title: "Bad Request",
            details: "Bad username or password",
            instance: req.originalUrl,
        }))
        return
    }

    //update last active
    if (!(await updateLastActive(user._id))) {
        response500(req, res)
    }

    const payload: JWTData = {
        userdata: {
            username: user.username,
            userID: user._id,
            isAdmin: user.isAdmin
        }
    }

    const accessToken = jwt.sign(
        payload,
        process.env.ACCESS_TOKEN_SECRET as string,
        {
            expiresIn: '1h'
        })


    const refreshPayload: JWTData = {
        userdata: {
            username: user.username,
            userID: user._id,
            isAdmin: user.isAdmin
        }
    }

    const refreshTokenToken = jwt.sign(
        refreshPayload,
        process.env.REFRESH_TOKEN_SECRET as string,
        {
            expiresIn: '1d'
        })

    res.cookie(
        'jwtRefreshTokenToken',
        refreshTokenToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
        secure: true,
    })
    res.json({ accessToken })
    loggerGeneral.info(`successfully authenticated user: ${username}`, { uuid: getRequestUUID() })
})

export const refreshToken = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const cookies = req.cookies;
    // check that cookie exist
    if (!cookies.jwtRefreshTokenToken) {
        res.status(401).json(problemDetails({
            type: "about:blank",
            title: "Unauthorized",
            details: "Unauthorized",
            instance: req.originalUrl,
        }))
        return
    }

    const refreshToken = cookies.jwtRefreshTokenToken

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET as string,
        async (err: VerifyErrors | null, decoded: any) => {
            const paylaod = decoded as JWTData

            if (err) {
                res.status(403).json(problemDetails({
                    type: "about:blank",
                    title: "Forbidden",
                    details: `Forbidden`,
                    instance: req.originalUrl,
                }))
                return
            }

            // get all user with username
            let userArr: User[] = []
            const fillter = { username: paylaod.userdata.username };
            userArr = await getDocuments<TUser>(
                "users",
                fillter
            );

            // check that account exist
            if (userArr.length == 0) {
                res.status(400).json(problemDetails({
                    type: "about:blank",
                    title: "Bad Request",
                    details: "Bad username or password",
                    instance: req.originalUrl,
                }))
                return
            }

            // check that only one use exist with said user name
            if (userArr.length != 1) {
                res.status(500).json(problemDetails({
                    type: "about:blank",
                    title: "Internal server error",
                    details: `Failed to refresh token to user '${paylaod.userdata.username}' due to the presence of multiple users with the same username.`,
                    instance: req.originalUrl,
                }))
                loggerGeneral.error(`Failed to refresh token to user '${paylaod.userdata.username}' due to the presence of multiple users with the same username.`, { uuid: getRequestUUID() })
                return
            }

            const user = userArr[0]

            // check if account is active
            if (!user.isActive) {
                res.status(403).json(problemDetails({
                    type: "about:blank",
                    title: "Account disabled",
                    details: `Account disabled`,
                    instance: req.originalUrl,
                }))
                return
            }

            //update last active
            if (!(await updateLastActive(user._id))) {
                response500(req, res)
                loggerGeneral.error(`failed to refresh token to user: ${paylaod.userdata.username} due to failing to update last active time of user`, { uuid: getRequestUUID() })
                return
            }

            const jwtData: JWTData = {
                userdata: {
                    username: user.username,
                    userID: user._id,
                    isAdmin: user.isAdmin
                }
            }
            const accessToken = jwt.sign(
                jwtData,
                process.env.ACCESS_TOKEN_SECRET as string,
                { expiresIn: '1d' }
            )

            res.json({ accessToken })
            loggerGeneral.info(`successfully refreshed token to user: ${paylaod.userdata.username}`, { uuid: getRequestUUID() })
        })
})

export async function logout(req: Request, res: Response) {
    const cookies = req.cookies
    if (!cookies?.jwtRefreshTokenToken) return res.sendStatus(204) //No content
    res.clearCookie('jwtRefreshTokenToken', { httpOnly: true, secure: true })
    res.json({ message: 'Cookie cleared' })
}