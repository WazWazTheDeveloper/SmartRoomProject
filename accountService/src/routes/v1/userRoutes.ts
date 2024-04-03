import express from "express"
import * as userController from "../../controllers/v1/userController";
import { userIDRouter } from "./userIDRoutes";
import { authenticateJWT } from "../../middleware/authenticateJWT";

export const userRouter: express.Router = express.Router();

userRouter.route("/").post(userController.createNewUser);
userRouter.route("/").delete(authenticateJWT,userController.deleteUser);

userRouter.use("/:UUID",authenticateJWT,userIDRouter)