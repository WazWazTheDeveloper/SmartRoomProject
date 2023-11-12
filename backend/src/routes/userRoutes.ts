import express, { Request, Response } from "express"
import * as userController from '../controllers/userController'
import { verifyJWT } from "../middleware/verifyJWT";

const router: express.Router = express.Router();

router.use(verifyJWT);

router.route('/permission')
    .post(userController.addPermissions)
    .delete(userController.removePermissions)

router.route('/is_active')
    .put(userController.setIsActive)

router.route('/is_admin')
    .put(userController.setIsAdmin)

router.route('/reset_password')
    .put(userController.resetPassword);

export { router as userRouter }