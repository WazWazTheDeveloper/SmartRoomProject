import express = require('express')
const router:express.Router = express.Router()

// import {index} from './routes/index';
import {deviceRouter} from './routes/deviceRoutes';
import { authRouter } from './routes/authRoutes';
import { taskRouter } from './routes/taskRoutes';
// import { appdataRouter } from './routes/appdata';

// router.use('/', index)
router.use('/auth', authRouter)
router.use('/device', deviceRouter)
router.use('/task', taskRouter)



export {router};
