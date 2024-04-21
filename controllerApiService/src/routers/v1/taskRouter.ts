import express = require('express')
import * as taskController from "../../controllers/v1/taskController"
export const taskRouter:express.Router = express.Router()

taskRouter.post('/',taskController.createTask)

export const taskIDRouter:express.Router = express.Router({ mergeParams : true })

taskRouter.use("/:UUID",taskIDRouter)

taskIDRouter.get('/',taskController.getTask)
taskIDRouter.put('/',taskController.updateTask)
taskIDRouter.delete('/',taskController.deleteTask)