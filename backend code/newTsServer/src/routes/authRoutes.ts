import express, { Request, Response } from "express"
import {verifyJWT} from '../middleware/verifyJWT'
import * as authController from '../controllers/authController'

const router: express.Router = express.Router();


router.route('/')
    .post( authController.login)

router.route('/refresh')
    .get(authController.refresh)

router.route('/logout')
    .post(authController.logout)

export {router as authRouter}