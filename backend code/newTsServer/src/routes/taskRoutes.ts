import express from "express"
import { verifyJWT } from "../middleware/verifyJWT";
import * as taskController from "../controllers/taskController";



const router: express.Router = express.Router();

router.use(verifyJWT);

router.route('/create-task')
    .post(taskController.createNewTask)

router.route('/update-task')
    .post(taskController.updateTask)

router.route('/delete-task')
    .post(taskController.deleteTask)

router.route('/add-var-check')
    .post(taskController.addVarChackToTask)

router.route('/add-time-check')
    .post(taskController.addTimeCheckToTask)

router.route('/add-todo')
    .post(taskController.addTodoToTask)

router.route('/remove-var-check')
    .post(taskController.removeVarChackToTask)

router.route('/remove-time-check')
    .post(taskController.removeTimeCheckToTask)

router.route('/remove-todo')
    .post(taskController.removeTodoToTask)

router.route('/update-var-check')
    .post(taskController.updateVarChackToTask)

router.route('/update-time-check')
    .post(taskController.updateTimeCheckToTask)
    
router.route('/update-todo')
    .post(taskController.updateTodoToTask)

export { router as taskRouter }
