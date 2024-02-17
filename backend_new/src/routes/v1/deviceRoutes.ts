import express = require('express')
import * as controller from '../../controllers/v1/deviceController'
export const deviceRouter:express.Router = express.Router()

deviceRouter.get('/',)
deviceRouter.post('/',controller.createNewDevice)
deviceRouter.put('/',controller.updateDevice)
deviceRouter.delete('/',controller.deleteDevice)