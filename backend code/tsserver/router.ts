import express = require('express')
const router:express.Router = express.Router()

import {index} from './routes/index';
import {newDevice} from './routes/new_device';

router.use('/', index)
router.use('/newDevice', newDevice)



export {router};
