import express, { Request, Response } from "express"
import asyncHandler from 'express-async-handler'
import { User } from "../models/user";

export const setIsAdmin = async (req: Request, res: Response) => {
    // TODO: add permission check of the user who send the reqest
    const { targetUser, newState } = req.body;
    if (!targetUser || typeof newState != "boolean") {
        res.status(400).json("invalid request")
        return
    }

    let user
    try {
        user = await User.getUser(targetUser)
    }
    catch (err) {
        res.status(400).json("invalid username")
        return
    }

    user.setIsAdmin(newState);

    res.status(200).json('success')
}

export const setIsActive = async (req: Request, res: Response) => {
    // TODO: add permission check of the user who send the reqest
    const { targetUser, newState } = req.body;
    if (!targetUser || typeof newState != "boolean") {
        res.status(400).json("invalid request")
        return
    }

    let user
    try {
        user = await User.getUser(targetUser)
    }
    catch (err) {
        res.status(400).json("invalid username")
        return
    }

    user.setIsActive(newState);

    res.status(200).json('success')
}

export const addPermissions = async (req: Request, res: Response) => {
    // TODO: add permission check of the user who send the reqest
    const { targetUser,newPermission } = req.body;
    if (!targetUser && !newPermission) {
        res.status(400).json("invalid request")
        return
    }

    let user
    try {
        user = await User.getUser(targetUser)
    }
    catch (err) {
        res.status(400).json("invalid username")
        return
    }

    await user.addPermission(newPermission);
    res.status(200).json('success')
}

// IMPLEMENT
export const removePermissions = async (req: Request, res: Response) => {
    // TODO: add permission check of the user who send the reqest
    const { targetUser,permission } = req.body;
    if (!targetUser && !permission) {
        res.status(400).json("invalid request")
        return
    }

    let user
    try {
        user = await User.getUser(targetUser)
    }
    catch (err) {
        res.status(400).json("invalid username")
        return
    }

    await user.removePermission(permission);
    res.status(200).json('success')
}

export const resetPassword = async (req: Request, res: Response) => {
    // TODO: add permission check of the user who send the reqest
    const { targetUser,newPassword } = req.body;
    if (!targetUser && !newPassword) {
        res.status(400).json("invalid request")
        return
    }

    let user
    try {
        user = await User.getUser(targetUser)
    }
    catch (err) {
        res.status(400).json("invalid username")
        return
    }

    await user.setPassword(newPassword);
    res.status(200).json('success')
}