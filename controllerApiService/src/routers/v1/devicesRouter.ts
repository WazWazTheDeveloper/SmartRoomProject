import express = require('express')
import * as deviceController from "../../controllers/v1/deviceController"
export const deviceRouter:express.Router = express.Router()

deviceRouter.put("/",deviceController.updateDevices)
deviceRouter.post("/",deviceController.getDeviceWithArray)
deviceRouter.get("/",deviceController.getAlldevices)

export const deviceIDRouter:express.Router = express.Router({ mergeParams : true })

deviceRouter.use("/:UUID",deviceIDRouter)

deviceIDRouter.delete('/',deviceController.deleteDevice)
deviceIDRouter.get('/',deviceController.getDevice)
deviceIDRouter.put('/',deviceController.updateDevice)
