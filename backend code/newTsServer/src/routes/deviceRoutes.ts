import express, { Request, Response } from "express"
import * as deviceController from '../controllers/deviceController'
import { verifyJWT } from "../middleware/verifyJWT";



const router: express.Router = express.Router();


router.route('/registerNewDevice')
    .post(deviceController.createNewDevice)

router.route('/getData')
    .get(deviceController.getData)

router.route('/getTopic')
    .get(deviceController.getTopic)

router.use(verifyJWT);

router.route('/update_device')
    .post(deviceController.update_device)

router.route('/delete_device')
    .post(deviceController.delete_device)
    .delete(deviceController.delete_device)

router.route('/update_name')
    .post(deviceController.update_name)

router.route('/is_accepted')
    .put(deviceController.setIsAccepted)

export { router as deviceRouter };
