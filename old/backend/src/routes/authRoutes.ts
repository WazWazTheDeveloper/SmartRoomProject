import express, { Request, Response } from "express"
import * as authController from '../controllers/authController'

const router: express.Router = express.Router();


router.route('/')
    .post( authController.login)

router.route('/refresh')
    .get(authController.refresh)

router.route('/logout')
    .post(authController.logout)

router.route('/signup')
    .post( authController.signup)

export {router as authRouter}