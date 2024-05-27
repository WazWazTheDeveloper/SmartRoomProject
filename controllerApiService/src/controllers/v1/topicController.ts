import express, { Request, Response, NextFunction } from "express"
import asyncHandler from "express-async-handler"
import { getPermissions } from "../../utils/getPermissions"
import { response500 } from "../../models/errors/500"
import * as TopicService from '../../services/mqttTopicService'
import { problemDetails } from "../../models/problemDetails"
import { response401 } from "../../models/errors/401"
import { verifyPermissions } from "../../utils/verifyPermissions"

export const createTopic = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

})

export const getAllTopics = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore we check for req.headers.authorization in middleware
    const userPermissionsResult = await getPermissions(req.headers.authorization, req._userID, "topic")
    if (!userPermissionsResult.isSuccessful) {
        response500(req, res);
        return
    }

    const topicIDs = []
    let canSeeAll = false;

    if (userPermissionsResult.data.isAdmin) {
        canSeeAll = true;
    } else {
        for (let i = 0; i < userPermissionsResult.data.permissions.length; i++) {
            const permission = userPermissionsResult.data.permissions[i];
            if (permission.read == true) {
                if (permission.objectId = "all") {
                    canSeeAll = true;
                }
                topicIDs.push(permission.objectId)
            }
        }
    }

    let topics;
    if (canSeeAll) {
        topics = await TopicService.getAllTopics()
    } else {
        topics = await TopicService.getTopicsFromIDArray(topicIDs)
    }

    if (!topics.isSuccessful) {
        response500(req, res);
        return
    }

    res.status(200).json(topics.mqttTopicObjects)
    return
})

export const getTopic = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { UUID } = req.params
    if (!UUID) {
        res.status(400).json(problemDetails({
            type: "about:blank",
            title: "Bad Request",
            details: "Bad request. Please provide a topic ID.",
            instance: req.originalUrl,
        }))
        return
    }
    
    // @ts-ignore we check for req.headers.authorization in middleware
    let permissionResult = await verifyPermissions(req.headers.authorization, req._userID, "topic", UUID, "read")
    if (!permissionResult) {
        response401(req, res)
        return
    }

    const result = await TopicService.getTopicByID(UUID)
    if (result.isSuccessful) {
        res.status(200).json(result.mqttTopicObject);
        return
    }else{
        response500(req,res);
        return
    }
})