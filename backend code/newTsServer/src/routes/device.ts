import express, { Request, Response } from "express"
import * as deviceController from '../controllers/deviceController'



const router: express.Router = express.Router();

router.use((req: Request, res: Response, next) => {
    next()
});

router.route('/registerNewDevice')
    .post(deviceController.createNewDevice)

router.route('/getData')
    .get(deviceController.getData)

router.route('/getTopic')
    .get(deviceController.getTopic)

router.route('/test')
    .post(deviceController.test)
    .get(deviceController.test)

// TODO: add update and stuff

export { router as deviceRouter };
