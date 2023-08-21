
import express, { NextFunction, Request, Response } from "express"
import asyncHandler from 'express-async-handler'
import { User } from "../models/user";
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const login = asyncHandler(async (req: Request, res: Response) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json('All fields are required')
        return
    }

    // TODO: add find user
    const foundUser= await User.getUser(username)


    if (!foundUser || !foundUser.getIsActive()) {
        res.status(401).json('Unauthorized')
    return
    }

    const match = await bcrypt.compare(password, foundUser.getPassword())
    if (!match) {
        res.status(401).json('Unauthorized')
        return
    }

    const accessToken = jwt.sign(
        {
            userInfo: {
                userName: foundUser.getUsername(),
                permission: foundUser.getPermissions()
            }
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '10s' }
    )
        console.log("asdasdasd")
    const refreshToken = jwt.sign(
        { "username": foundUser.getUsername },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    )

    // Create secure cookie with refresh token 
    res.cookie('jwt', refreshToken, {
        httpOnly: true, //accessible only by web server 
        secure: true, //https
        maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expiry: set to match rT
    })

    // Send accessToken containing username and roles 
    res.json({ accessToken })
})

const refresh = (req: Request, res: Response) => {
    const cookies = req.cookies

    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' })

    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        asyncHandler(async (err, decoded) => {
            if (err) {
                res.status(403).json({ message: 'Forbidden' })
                return
            }

            // find info
            // const foundUser = await User.findOne({ username: decoded.username }).exec()
            // TODO: add find user
            const foundUser: any = {}
            foundUser.isActive = false;
            foundUser.password = "false";

            if (!foundUser) {
                res.status(401).json({ message: 'Unauthorized' })
                return
            }

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": foundUser.username,
                        "permission": foundUser.getPermissions()
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            )

            res.json({ accessToken })
        })
    )
}

const logout = (req: Request, res: Response) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204) //No content
    res.clearCookie('jwt', { httpOnly: true, secure: true })
    res.json({ message: 'Cookie cleared' })
}

export {   
    login,
    refresh,
    logout }