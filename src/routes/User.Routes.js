import { Router } from "express";
import { getUsers, createUser, login, deleteUser, actualizateUser, getUserById } from "../controllers/User.Controller.js";
import { validateUser, validateLogin } from "../middleware/models.js";
import { authenticateToken } from "../middleware/jwt.js";

const userRouter = Router();

//login
userRouter.post("/login", validateLogin, login);

//register
userRouter.post('/user', validateUser, createUser);

//getUser
userRouter.get('/users', getUsers);

//getUserById
userRouter.get('/user', authenticateToken, getUserById)

// Eliminar usuario por ID
userRouter.delete('/user', authenticateToken, deleteUser);

// Actualizar usuario por ID
userRouter.put('/user', authenticateToken, validateUser, actualizateUser);

export default userRouter;