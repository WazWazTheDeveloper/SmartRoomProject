import express from "express"
import { verifyJWT } from "../middleware/verifyJWT";
import * as taskController from "../controllers/taskController";
// import * as userController from '../controllers/userController'



const router: express.Router = express.Router();

router.use(verifyJWT);

router.route('/create_task')
    .post(taskController.createNewTask)

router.route('/update_task')
    .post(taskController.updateTask)

router.route('/delete_task')
    .post(taskController.deleteTask)

router.route('/var_check')
    .post(taskController.addVarChackToTask)
    .delete(taskController.removeVarChackToTask)
    .put(taskController.updateVarChackToTask)

router.route('/time_check')
    .post(taskController.addTimeCheckToTask)
    .delete(taskController.removeTimeCheckToTask)
    .put(taskController.updateTimeCheckToTask)

router.route('/todo')
    .post(taskController.addTodoToTask)
    .delete(taskController.removeTodoToTask)
    .put(taskController.updateTodoToTask)    

export { router as taskRouter }