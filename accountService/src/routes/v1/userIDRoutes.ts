import express from "express"
import * as userIDController from "../../controllers/v1/userIDController";

export const userIDRouter: express.Router = express.Router({ mergeParams : true });
userIDRouter.route("/permission").get(userIDController.getUserPermissions)
userIDRouter.route("/permission").post(userIDController.updateUserPermissions)