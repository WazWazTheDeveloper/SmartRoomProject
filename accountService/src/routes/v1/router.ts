import express = require('express')
import { userRouter } from './userRoutes'
export const routerv1:express.Router = express.Router()

routerv1.use("/user",userRouter)