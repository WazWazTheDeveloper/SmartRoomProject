import express, { Request, Response, NextFunction } from "express"
import asyncHandler from "express-async-handler"
import { getPermissions } from "../../utils/getPermissions"
import { response500 } from "../../models/errors/500"
import * as topicService from '../../services/mqttTopicService'

export const createTopic = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

})

export const getAllTopics = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore we check for req.headers.authorization in middleware
    const userPermissionsResult = await getPermissions(req.headers.authorization, req._userID, "topic")
    console.log(userPermissionsResult)
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
    if(canSeeAll) {
        topics = await topicService.getAllTopics()
    } else {
        topics = await topicService.getTopicsFromIDArray(topicIDs)
    }

    if(!topics.isSuccessful) {
        response500(req,res);
        return
    }

    res.status(200).json(topics.mqttTopicObjects)
    return
}) 