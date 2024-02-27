import express = require('express')
import * as taskController from '../../restControllers/v1/taskController';

export const taskRouter:express.Router = express.Router()

taskRouter.get('/', taskController.getTask);
taskRouter.post('/',taskController.createNewTask);
taskRouter.put('/',taskController.updateTask);
taskRouter.delete('/', taskController.deleteTask);