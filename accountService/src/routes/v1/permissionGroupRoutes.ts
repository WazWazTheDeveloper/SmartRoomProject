import express from "express"
import * as permissionGroupController from '../../controllers/v1/permissionGroupController'
export const permissionGroupRouter: express.Router = express.Router();

permissionGroupRouter.post('/',permissionGroupController.createNewGroup)



export const permissionGroupIDRouter: express.Router = express.Router({ mergeParams : true });
permissionGroupRouter.use("/:UUID",permissionGroupIDRouter)

permissionGroupIDRouter.post('/',permissionGroupController.updateGroupPermissions)

