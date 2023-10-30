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

// TODO: uncomment
// router.use(verifyJWT);

router.route('/update_device')
    .post(deviceController.update_device)

router.route('/delete_device')
    .post(deviceController.delete_device)

export { router as deviceRouter };
