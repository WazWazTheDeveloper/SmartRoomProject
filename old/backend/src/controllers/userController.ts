import express, { Request, Response } from "express"
import asyncHandler from 'express-async-handler'
import { User } from "../models/user";

export const setIsAdmin = async (req: Request, res: Response) => {
    if (!req.username) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
    let _user = await User.getUser(req.username!)
    if (!_user.getIsAdmin()) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

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
    if (!req.username) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
    let _user = await User.getUser(req.username!)
    if (!_user.getIsAdmin()) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

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
    // FIXME: wtf is this?!?!?!?!?
    if (!req.username) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
    let _user = await User.getUser(req.username!)
    if (!_user.getIsAdmin()) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const { targetUser, newPermission } = req.body;
    if (!targetUser || !newPermission) {
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

export const removePermissions = async (req: Request, res: Response) => {
    // FIXME: wtf is this?!?!?!?!?
    if (!req.username) {
        return res.status(400).json({ message: 'invalid request' })
    }
    let _user = await User.getUser(req.username!)
    if (!_user.getIsAdmin()) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const { targetUser, permission } = req.body;
    if (!targetUser || !permission) {
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
    if (!req.username) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
    let _user = await User.getUser(req.username!)
    if (!_user.getIsAdmin()) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const { targetUser, newPassword } = req.body;
    if (!targetUser || !newPassword) {
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

export const addGroup = async (req: Request, res: Response) => {
    const { targetUser, newGroup } = req.body;
    if (!targetUser || !newGroup) {
        res.status(400).json("invalid request")
        return
    }

    let user
    try {
        user = await User.getUser(targetUser)
        await user.addGroup(newGroup);
        res.status(200).json('success')
    }
    catch (err) {
        res.status(400).json("invalid group id")
        return
    }
}

export const removeGroup = async (req: Request, res: Response) => {
    const { targetUser, deleteGroup } = req.body;
    if (!targetUser || !deleteGroup) {
        res.status(400).json("invalid request")
        return
    }

    let user
    try {
        user = await User.getUser(targetUser)
        await user.removeGroup(deleteGroup);
        res.status(200).json('success')
    }
    catch (err) {
        res.status(400).json("invalid group id")
        return
    }
}