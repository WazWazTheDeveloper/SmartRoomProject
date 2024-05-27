import express = require('express')
import { deviceRouter } from './devicesRouter'
import { taskRouter } from './taskRouter'
import { topicRouter } from './topicRouter'
export const routerv1:express.Router = express.Router()

routerv1.use("/device",deviceRouter)
routerv1.use("/task",taskRouter)
routerv1.use("/topic",topicRouter)