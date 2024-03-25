import { Request, Response } from "express";
import * as taskService from "../../services/taskService";

export async function createNewTask(req: Request, res: Response) {
    let { taskName } = req.body;

    if (!taskName) {
        taskName = "unnamed task"
    }

    try {
        const taskResult = await taskService.createTask(taskName);
        if(taskResult.isSuccessful){
            res.status(200);
            res.send("ok");
        }
        else [
            res.status(400).json("invalid request")
        ]
    } catch (e) {
        //TODO add logs
        console.log(e)
        res.status(400).json("invalid request")
    }
}

export async function updateTask(req: Request, res: Response) {
    const { taskID,propertyList } = req.body;
    if(!taskID || !propertyList || !Array.isArray(propertyList)) {
        res.status(400).json("invalid request")
        return
    }

    try {
        await taskService.updateTaskProperty(taskID, propertyList);
        res.status(200).json("ok")
    } catch (e) {
        // add logs
        console.log(e)
        res.status(400).json("invalid request")
    }

}

export async function deleteTask(req: Request, res: Response) {
    const { taskID } = req.body;

    await taskService.deleteTask(taskID);

    res.status(200).json("ok")
}

export async function getTask(req: Request, res: Response) {
    res.status(501).send();
}