import express, { Request, Response } from "express"
import * as deviceController from '../controllers/deviceController'
import { verifyJWT } from "../middleware/verifyJWT";



const router: express.Router = express.Router();

// router.use(verifyJWT);

router.route('/registerNewDevice')
    .post(deviceController.createNewDevice)

router.route('/getData')
    .get(deviceController.getData)

router.route('/getTopic')
    .get(deviceController.getTopic)

router.route('/test')
    .post(deviceController.test)
    .get(deviceController.test)

router.route('/update_device')
    .post(deviceController.update_device)

// TODO: add update and stuff

export { router as deviceRouter };
