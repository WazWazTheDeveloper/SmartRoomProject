import express = require('express')
import * as taskController from "../../controllers/v1/taskController"
export const taskRouter:express.Router = express.Router()

taskRouter.post('/',taskController.createTask)

export const taskIDRouter:express.Router = express.Router()

taskRouter.use("/:UUID",taskIDRouter)

taskRouter.get('/',taskController.getTask)
taskRouter.post('/',taskController.updateTask)
taskRouter.delete('/',taskController.deleteTask)