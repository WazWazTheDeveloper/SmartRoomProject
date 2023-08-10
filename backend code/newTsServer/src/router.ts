import express = require('express')
const router:express.Router = express.Router()

// import {index} from './routes/index';
import {deviceRouter} from './routes/device';
// import { appdataRouter } from './routes/appdata';

// router.use('/', index)
router.use('/device', deviceRouter)
// router.use('/appdata', appdataRouter)



export {router};
