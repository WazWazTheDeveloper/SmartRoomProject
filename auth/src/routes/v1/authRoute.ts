import express from "express"
import { login } from "../../controllers/v1/authController";

export const loginRouter: express.Router = express.Router();

loginRouter.route("/").post(login);