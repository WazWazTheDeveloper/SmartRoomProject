import express, { Request, Response } from "express"
import { User } from "../../modules/user";
import { getDocuments } from "../../services/mongoDBService";
import { TUser } from "../../interfaces/user.interface";
import bcrypt from 'bcrypt';
import jwt, { VerifyErrors } from 'jsonwebtoken';
import { updateLastActive } from "../../services/userService";
import { loggerGeneral } from "../../services/loggerService";
import { getRequestUUID } from "../../middleware/requestID";

type JWTData = {
    userdata: {
        username: string
    }
}
export async function login(req: Request, res: Response) {
    const { username, password } = req.body;
    // check that all field exist
    // TODO: add type checking
    if (!username || !password) {
        res.status(400).json('All fields are required')
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
        res.status(500).json('500 Internal Server Error')
        loggerGeneral.error(`failed to authenticated user: ${username} dua to internal server error`, { uuid: getRequestUUID() })
        return
    }

    // check that account exist
    if (userArr.length == 0) {
        res.status(400).json('bad username of password')
        return
    }

    // check that only one use exist with said user name
    if (userArr.length != 1) {
        res.status(500).json('500 Internal Server Error')
        loggerGeneral.error(`failed to authenticated user: ${username} dua to to having more then one user with the same user name`, { uuid: getRequestUUID() })
        return
    }

    const user = userArr[0]

    // check if account is active
    if (!user.isActive) {
        res.status(403).json('account disabled')
        return
    }

    // check password
    const response = await bcrypt.compare(password, user.password)
    if (!response) {
        res.status(400).json('bad username of password')
        return
    }

    //update last active
    if (!(await updateLastActive(user._id))) {
        res.status(500).json('500 Internal Server Error')
        loggerGeneral.error(`failed to authenticated user: ${username} dua to internal server error`, { uuid: getRequestUUID() })
        return
    }

    const payload: JWTData = {
        userdata: {
            username: user.username
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
            username: user.username
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
}

export async function refreshToken(req: Request, res: Response) {
    const cookies = req.cookies;
    // check that cookie exist
    if (!cookies.jwtRefreshTokenToken) return res.status(401).json({ message: 'Unauthorized' })

    const refreshToken = cookies.jwtRefreshTokenToken

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET as string,
        async (err: VerifyErrors | null, decoded: any) => {
            const paylaod = decoded as JWTData

            if (err) {
                res.status(403).json({ message: 'Forbidden' })
                return
            }

            // get all user with username
            let userArr: User[] = []
            try {
                const fillter = { username: paylaod.userdata.username };
                userArr = await getDocuments<TUser>(
                    "users",
                    fillter
                );
            } catch (err) {
                res.status(500).json('500 Internal Server Error')
                loggerGeneral.error(`failed to refresh token to user: ${paylaod.userdata.username} dua to internal server error`, { uuid: getRequestUUID() })
                return
            }

            // check that account exist
            if (userArr.length == 0) {
                res.status(400).json('bad username of password')
                return
            }

            // check that only one use exist with said user name
            if (userArr.length != 1) {
                res.status(500).json('500 Internal Server Error')
                loggerGeneral.error(`failed to refresh token to user: ${paylaod.userdata.username} dua to to having more then one user with the same user name`, { uuid: getRequestUUID() })
                return
            }

            const user = userArr[0]

            // check if account is active
            if (!user.isActive) {
                res.status(403).json('account disabled')
                return
            }

            //update last active
            if (!(await updateLastActive(user._id))) {
                res.status(500).json('500 Internal Server Error')
                loggerGeneral.error(`failed to refresh token to user: ${paylaod.userdata.username} dua to failing to update last active time of user`, { uuid: getRequestUUID() })
                return
            }

            const jwtData = {
                userInfo: {
                    username: user.username,
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
}

export async function logout(req: Request, res: Response) {
    const cookies = req.cookies
    if (!cookies?.jwtRefreshTokenToken) return res.sendStatus(204) //No content
    res.clearCookie('jwtRefreshTokenToken', { httpOnly: true, secure: true })
    res.json({ message: 'Cookie cleared' })
}