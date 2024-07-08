import { Router } from "express";
import { createTask, deleteTask, getTask, updateTask } from "../controllers/task-controllers.js";
import { authenticateToken  } from "../middleware/validacion.js"; // Importa la función validateUser desde el archivo validacion.js


const taskRouter = Router();

taskRouter.get('/task', authenticateToken, getTask);

taskRouter.post('/task', authenticateToken, createTask);

taskRouter.put('/task/:task_id', authenticateToken, updateTask);

taskRouter.delete("/task/:task_id", authenticateToken, deleteTask);


export default taskRouter;
