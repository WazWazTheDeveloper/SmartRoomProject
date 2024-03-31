import express from "express"
import * as userController from "../../controllers/v1/userController";
import { userIDRouter } from "./userIDRoutes";

export const userRouter: express.Router = express.Router();

userRouter.route("/").post(userController.createNewUser);
userRouter.route("/").delete(userController.deleteUser);

userRouter.use("/:UUID",userIDRouter)