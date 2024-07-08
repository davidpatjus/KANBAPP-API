import { Router } from "express";
import { getUser, createUser, login, deleteUser, actualizateUser } from "../controllers/user-controllers.js";
import { validateUser, authenticateToken  } from "../middleware/validacion.js"; // Importa la función validateUser desde el archivo validacion.js


const userRouter = Router();

//login
userRouter.post("/login", validateUser, login);

//register
userRouter.post('/users', validateUser, createUser);

//getUser
userRouter.get('/users', getUser);

// Eliminar usuario por ID
userRouter.delete('/users/:id', authenticateToken, deleteUser);

// Actualizar usuario por ID
userRouter.put('/users/:id', validateUser, authenticateToken, actualizateUser);

export default userRouter;