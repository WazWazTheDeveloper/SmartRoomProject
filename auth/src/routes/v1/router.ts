import express = require('express')
import { loginRouter } from './authRoute'
export const routerv1:express.Router = express.Router()

routerv1.use("/login",loginRouter)