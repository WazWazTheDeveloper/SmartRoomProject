import express, { Request, Response } from "express"
import * as permissionGroupsController from '../controllers/permissionGroupsController'
import { verifyJWT } from "../middleware/verifyJWT";

const router: express.Router = express.Router();

router.use(verifyJWT);

router.route('/groups')
    .get(permissionGroupsController.getAllGroups)
    .post(permissionGroupsController.createNewGroup)
    .delete(permissionGroupsController.deleteGroup)

router.route('/permission')
    .post(permissionGroupsController.addPermission)
    .delete(permissionGroupsController.deletePermission)

export {router as permissionGroupsRouter}
