import express, { Request, Response } from "express"
import { User } from "../../modules/user";
import { getDocuments } from "../../services/mongoDBService";
import { TUser } from "../../interfaces/user.interface";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function login(req: Request, res: Response) {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json('All fields are required')
        return
    }

    let userArr: User[] = []
    try {
        const fillter = { username: username };
        userArr = await getDocuments<TUser>(
            "users",
            fillter
        );
    } catch (err) {
        res.status(500).json('500 Internal Server Error')
        return
    }

    if (userArr.length != 1) {
        res.status(500).json('500 Internal Server Error')
        return
    }

    const user = userArr[0]
    const response = await bcrypt.compare(password, user.password)
    if (!response) {
        res.status(401).json('bad password')
        return
    }

    const accessToken = jwt.sign({
        userData: {
            username: user.username
        }
    },
        process.env.ACCESS_TOKEN_SECRET as string,
        {
            expiresIn: '1h'
        })


    const refreshTokenToken = jwt.sign(
        {
            userData: {
                username: user.username
            }
        },
        process.env.ACCESS_TOKEN_SECRET as string,
        {
            expiresIn: '1d'
        })

    res.cookie(
        'jwtRefreshTokenToken',
        refreshTokenToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
        //TODO: change this to true
        secure: true,
    })
    res.json({accessToken})
}