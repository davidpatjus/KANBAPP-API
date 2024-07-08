import { Router } from "express";
import { getSection, createSection, deleteSection, updateSection } from "../controllers/section-controllers.js";
import { authenticateToken  } from "../middleware/validacion.js"; // Importa la función validateUser desde el archivo validacion.js

const sectionRouter = Router();

sectionRouter.get("/section/:id_users", authenticateToken, getSection); 

sectionRouter.post("/section", authenticateToken, createSection);

sectionRouter.delete("/section/:id_section", authenticateToken, deleteSection);

sectionRouter.put("/section/:id_section", authenticateToken, updateSection);

export default sectionRouter