import express from "express"
import { verifyJWT } from "../middleware/verifyJWT";
import * as taskController from "../controllers/taskController";



const router: express.Router = express.Router();

router.use(verifyJWT);

router.route('/create-new-task')
    .post(taskController.createNewTask)

router.route('/add-var-check')
    .post(taskController.addVarChackToTask)

router.route('/add-time-check')
    .post(taskController.addTimeCheckToTask)

router.route('/add-todo')
    .post(taskController.addTodoToTask)

export {router as taskRouter}
