import express = require('express')
import { deviceRouter } from './deviceRoutes'
import { taskRouter } from './taskRoutes'
export const routerv1:express.Router = express.Router()

routerv1.use("/device",deviceRouter)
routerv1.use("/task",taskRouter)