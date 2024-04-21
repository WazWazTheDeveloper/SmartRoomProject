import express, { Request, Response, NextFunction } from "express"
import asyncHandler from "express-async-handler"
import { problemDetails } from "../../models/problemDetails";
import { response401 } from "../../models/errors/401";
import { verifyPermissions } from "../../utils/verifyPermissions";
import * as taskService from "../../services/taskService";


export const createTask = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
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

export const getTask = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

})

export const updateTask = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { propertyList } = req.body;
    const { UUID } = req.params
    if (!UUID || !propertyList || !Array.isArray(propertyList)) {
        res.status(400).json(problemDetails({
            type: "about:blank",
            title: "Bad Request",
            details: "Bad request. Please ensure propertyList is provided and of type Array, and taskID is a string.",
            instance: req.originalUrl,
        }))
        return
    }

    // @ts-ignore we check for req.headers.authorization in middleware
    let permissionResult = await verifyPermissions(req.headers.authorization, req._userID, "task", UUID, "write")
    if (!permissionResult) {
        response401(req, res);
        return
    }

    await taskService.updateTaskProperty(UUID, propertyList);
    res.status(200).json("ok")
})

export const deleteTask = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { UUID } = req.params;

    if (!UUID) {
        res.status(400).json(problemDetails({
            type: "about:blank",
            title: "Bad Request",
            details: "Bad request. Please ensure taskID is provided.",
            instance: req.originalUrl,
        }))
        return
    }

    console.log(UUID)

    // @ts-ignore we check for req.headers.authorization in middleware
    let permissionResult = await verifyPermissions(req.headers.authorization, req._userID, "task", UUID, "delete")
    if (!permissionResult) {
        response401(req, res);
        return
    }

    await taskService.deleteTask(UUID);
    res.status(200).json("ok")
})