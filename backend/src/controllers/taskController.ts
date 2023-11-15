import express, { NextFunction, Request, Response } from "express"
import { AppData } from "../appData";
import { Task } from "../models/task";
import { v4 as uuidv4 } from 'uuid';

const createNewTask = async (req: Request, res: Response) => {
    let taskId = uuidv4();
    const appdata = await AppData.getAppDataInstance();
    appdata.createTask(taskId, "newTask", false, false);

    res.status(200).json('success')
}

const updateTask = async (req: Request, res: Response) => {
    const { targetTask, data } = req.body;
    if (!targetTask || !data) {
        res.status(400).json("invalid request")
        return
    }

    const appdata = await AppData.getAppDataInstance();
    let task: Task
    try {
        task = appdata.getTaskById(targetTask);
    } catch (err) {
        res.status(400).json("invalid task id")
        return
    }

    await task.updateData(data);

    res.status(200).json('success')
}

const deleteTask = async (req: Request, res: Response) => {
    const { targetTask } = req.body;

    if (!targetTask) {
        res.status(400).json("invalid request")
        return
    }

    const appdata = await AppData.getAppDataInstance();
    appdata.removeTask(targetTask);
    res.status(200).json('success')
}

const addVarChackToTask = async (req: Request, res: Response) => {
    const { targetTask, deviceId, dataIndex, varName, checkType, valueToCompareTo } = req.body;
    if (!targetTask || !deviceId || (!dataIndex && dataIndex !== 0) || !varName || (!checkType && checkType !== 0) || !valueToCompareTo) {
        res.status(400).json("invalid request")
        return
    }

    const appdata = await AppData.getAppDataInstance();

    let task: Task
    try {
        task = appdata.getTaskById(targetTask);
    } catch (err) {
        res.status(400).json("invalid task id")
        return
    }

    task.addVarCheck(deviceId, dataIndex, varName, checkType, valueToCompareTo);

    res.status(200).json('success')
}

const addTimeCheckToTask = async (req: Request, res: Response) => {
    const { targetTask, timingData } = req.body;
    if (!targetTask || !timingData) {
        res.status(400).json("invalid request")
        return
    }

    const appdata = await AppData.getAppDataInstance();

    let task: Task
    try {
        task = appdata.getTaskById(targetTask);
    } catch (err) {
        res.status(400).json("invalid task id")
        return
    }

    task.addTimedCheck(timingData);

    res.status(200).json('success')
}

const addTodoToTask = async (req: Request, res: Response) => {
    const { targetTask, deviceId, dataIndex, varName, changeTo } = req.body;
    if (!targetTask || !deviceId || (!dataIndex && dataIndex !== 0) || !varName || !changeTo) {
        res.status(400).json("invalid request")
        return
    }

    const appdata = await AppData.getAppDataInstance();

    let task: Task
    try {
        task = appdata.getTaskById(targetTask);
    } catch (err) {
        res.status(400).json("invalid task id")
        return
    }

    task.addTodoTask(deviceId, dataIndex, varName, changeTo);

    res.status(200).json('success')
}

const removeVarChackToTask = async (req: Request, res: Response) => {
    const { targetTask, indexOfVarCheck } = req.body;
    if(!targetTask || !(typeof indexOfVarCheck == "number")) {

        res.status(400).json("invalid request")
        return
    }

    const appdata = await AppData.getAppDataInstance();

    let task: Task
    try {
        task = appdata.getTaskById(targetTask);
    } catch (err) {
        res.status(400).json("invalid task id")
        return
    }

    task.removeVarCheck(indexOfVarCheck)

    res.status(200).json('success')
}

const removeTimeCheckToTask = async (req: Request, res: Response) => {
    const { targetTask, indexOfTimeCheck } = req.body;
    if(!targetTask && !(typeof indexOfTimeCheck == 'number')) {
        res.status(400).json("invalid request")
        return
    }

    const appdata = await AppData.getAppDataInstance();

    let task: Task
    try {
        task = appdata.getTaskById(targetTask);
    } catch (err) {
        res.status(400).json("invalid task id")
        return
    }

    task.removeTimedCheck(indexOfTimeCheck)

    res.status(200).json('success')
}

const removeTodoToTask = async (req: Request, res: Response) => {
    const { targetTask, indexOfTodoTask } = req.body;
    if(!targetTask && !(typeof indexOfTodoTask == 'number')) {
        res.status(400).json("invalid request")
        return
    }

    const appdata = await AppData.getAppDataInstance();

    let task: Task
    try {
        task = appdata.getTaskById(targetTask);
    } catch (err) {
        res.status(400).json("invalid task id")
        return
    }

    task.removeTodoTask(indexOfTodoTask)

    res.status(200).json('success')
}

const updateVarChackToTask = async (req: Request, res: Response) => {

}

const updateTimeCheckToTask = async (req: Request, res: Response) => {

}

const updateTodoToTask = async (req: Request, res: Response) => {

}


export {
    createNewTask,
    updateTask,
    deleteTask,
    addVarChackToTask,
    addTimeCheckToTask,
    addTodoToTask,
    removeVarChackToTask,
    removeTimeCheckToTask,
    removeTodoToTask,
    updateVarChackToTask,
    updateTimeCheckToTask,
    updateTodoToTask
}