import express = require('express')
import { userRouter } from './userRoutes'
import { permissionGroupRouter } from './permissionGroupRoutes'
export const routerv1:express.Router = express.Router()

routerv1.use("/user",userRouter)
routerv1.use("/permissionGroup",permissionGroupRouter)