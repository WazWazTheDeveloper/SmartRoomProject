import express = require('express')
import * as topicController from '../../controllers/v1/topicController'

export const topicRouter:express.Router = express.Router()

topicRouter.post('/',topicController.createTopic)
topicRouter.get('/',topicController.getAllTopics)

export const topicIDRouter:express.Router = express.Router({ mergeParams : true })
topicRouter.use("/:UUID",topicIDRouter)

topicIDRouter.get('/',topicController.getTopic)
topicIDRouter.patch('/',topicController.updateTopic)