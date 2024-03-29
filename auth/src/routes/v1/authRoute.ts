import express from "express"
import { login, refreshToken } from "../../controllers/v1/authController";

export const loginRouter: express.Router = express.Router();

loginRouter.route("/login").post(login);
loginRouter.route("/refresh").post(refreshToken);