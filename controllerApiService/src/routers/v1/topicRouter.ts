import express = require('express')
import * as topicController from '../../controllers/v1/topicController'

export const topicRouter:express.Router = express.Router()

topicRouter.post('/',topicController.createTopic)
topicRouter.get('/',topicController.getAllTopics)

