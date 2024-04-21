import express = require('express')
export const deviceRouter:express.Router = express.Router()

export const deviceIDRouter:express.Router = express.Router()

deviceRouter.use("/:UUID",deviceIDRouter)
