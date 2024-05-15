import express, { Request, Response, NextFunction } from "express"
import asyncHandler from "express-async-handler"
import { problemDetails } from "../../models/problemDetails";
import { response401 } from "../../models/errors/401";
import { verifyPermissions } from "../../utils/verifyPermissions";
import * as TaskService from "../../services/taskService";
import axios from "axios";
import { getRequestUUID } from "../../middleware/requestID";
import { response500 } from "../../models/errors/500";


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

    const taskResult = await TaskService.createTask(taskName);
    if (taskResult.isSuccessful) {
        res.status(200).json(taskResult.task._id);
    }

    next();
})

export const getAllTasks = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    type TResponseData = {
        _id: String
        isAdmin: boolean
        permissions: {
            type: "task"
            objectId: string | "all"
            read: boolean
            write: boolean
            delete: boolean
        }[]
    }
    const result = await axios.get(`http://${process.env.ACCOUNT_SERVICE as string}/api/v1/user/${req._userID}/permission?permission_type=task`, {
        headers: {
            "X-Request-ID": getRequestUUID(),
            Authorization: req.headers.authorization
        }
    })
    const resultData: TResponseData = result.data

    const taskID = []
    let canSeeAll = false;

    for (let i = 0; i < resultData.permissions.length; i++) {
        const permission = resultData.permissions[i];
        if (permission.read == true) {
            if (permission.objectId = "all") {
                canSeeAll = true;
            }
            taskID.push(permission.objectId)
        }
    }

    let taskResult: TaskService.TasksResult;
    if (resultData.isAdmin || canSeeAll) {
        taskResult = await TaskService.getAllTasks();
    }
    else {
        taskResult = await TaskService.getTaskArray(taskID);
    }

    if (taskResult.isSuccessful) {
        res.status(200).json(taskResult.tasks)
    } else {
        response500(req, res)
    }

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

    await TaskService.updateTaskProperty(UUID, propertyList);
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

    await TaskService.deleteTask(UUID);
    res.status(200).json("ok")
})