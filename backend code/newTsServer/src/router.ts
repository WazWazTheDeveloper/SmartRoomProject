import express = require('express')
const router:express.Router = express.Router()

// import {index} from './routes/index';
import {deviceRouter} from './routes/device';
import { authRouter } from './routes/authRoutes';
// import { appdataRouter } from './routes/appdata';

// router.use('/', index)
router.use('/auth', authRouter)
router.use('/device', deviceRouter)



export {router};
