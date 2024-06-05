import express from "express"
import * as userIDController from "../../controllers/v1/userIDController";

export const userIDRouter: express.Router = express.Router({ mergeParams: true });
userIDRouter.route("/permission").get(userIDController.getUserPermissions)
userIDRouter.route("/permission").post(userIDController.updateUserPermissions)
userIDRouter.route("/permission/group").post(userIDController.updateUserPermissionGroups)
userIDRouter.route("/check-permission").get(userIDController.checkUserPermission)

userIDRouter.route("/darkmode").put(userIDController.updateDarkMode)
userIDRouter.route('/settings').get(userIDController.setUserSettings)

userIDRouter.route("/settings/favorite-devices")
    .get(userIDController.getUserFavoriteDevices)
    .post(userIDController.updateUserFavoriteDevices)
