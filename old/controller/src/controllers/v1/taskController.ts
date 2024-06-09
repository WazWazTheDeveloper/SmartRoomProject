import express, { Request, Response, NextFunction } from "express"
import * as taskService from "../../services/taskService";
import asyncHandler from "express-async-handler"
import { verifyPermissions } from "../../utils/verifyPermissions";
import { response401 } from "../../models/errors/401";
import { problemDetails } from "../../models/problemDetails";

export const createNewTask = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore we check for req.headers.authorization in middleware
    let permissionResult = await verifyPermissions(req.headers.authorization, req._userID, "task", "all", "write")
    if (!permissionResult) {
        response401(req, res);
        return
    }

    let { taskName } = req.body;

    if (!taskName) {
        taskName = "new task"
    }

    const taskResult = await taskService.createTask(taskName);
    if (taskResult.isSuccessful) {
        res.status(200).json("ok");
    }

    next();
})

export const updateTask = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { taskID, propertyList } = req.body;
    if (!taskID || !propertyList || !Array.isArray(propertyList)) {
        res.status(400).json(problemDetails({
            type: "about:blank",
            title: "Bad Request",
            details: "Bad request. Please ensure propertyList is provided and of type Array, and taskID is a string.",
            instance: req.originalUrl,
        }))
        return
    }

    // @ts-ignore we check for req.headers.authorization in middleware
    let permissionResult = await verifyPermissions(req.headers.authorization, req._userID, "task", taskID, "write")
    if (!permissionResult) {
        response401(req, res);
        return
    }

    await taskService.updateTaskProperty(taskID, propertyList);
    res.status(200).json("ok")
})

export const deleteTask = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { taskID } = req.body;

    if (!taskID) {
        res.status(400).json(problemDetails({
            type: "about:blank",
            title: "Bad Request",
            details: "Bad request. Please ensure taskID is provided.",
            instance: req.originalUrl,
        }))
        return
    }

    // @ts-ignore we check for req.headers.authorization in middleware
    let permissionResult = await verifyPermissions(req.headers.authorization, req._userID, "task", taskID, "delete")
    if (!permissionResult) {
        response401(req, res);
        return
    }

    await taskService.deleteTask(taskID);
    res.status(200).json("ok")
})

export async function getTask(req: Request, res: Response) {
    res.status(501).send();
}