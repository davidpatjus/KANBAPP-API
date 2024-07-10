import { Router } from "express";
import { createTask, deleteTask, getTask, updateTask, updateTaskSection } from "../controllers/Task.Controller.js";
import { authenticateToken } from "../middleware/jwt.js";


const taskRouter = Router();

taskRouter.get('/task', authenticateToken, getTask);

taskRouter.post('/task', authenticateToken, createTask);

taskRouter.patch('/task', authenticateToken, updateTaskSection)

taskRouter.put('/task/:task_id', authenticateToken, updateTask);

taskRouter.delete("/task/:task_id", authenticateToken, deleteTask);


export default taskRouter;
