import express from "express"

const router: express.Router = express.Router();

router.route("signup").post();
router.route("login").post();