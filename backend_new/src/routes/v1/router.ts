import express = require('express')
import { deviceRouter } from './deviceRoutes'
import { taskRouter } from './taskRoutes'
export const router:express.Router = express.Router()

router.use("/device",deviceRouter)
router.use("/task",taskRouter)