import { jwtVerify } from "jose";
import dotenv from 'dotenv';

dotenv.config();

// Middleware para validar el formato de email
  const validateEmail = (email) => {
      // Expresión regular para validar formato de email básico
      const re = /^[^\s@]+@[^\s@]+.[^\s@]+$/;
      return re.test(String(email).toLowerCase());
    };
  
  // Middleware de validación personalizado
  const validateUser = (req, res, next) => {
    const { name, email, password } = req.body;
  
  
    // Verificar que name sea una cadena y tenga como máximo 100 caracteres

    if ( !isNaN(name) ||  name.length > 50 || name.length < 4) {
      return res.status(400).json({ error: 'El nombre debe ser una cadena de texto de minimo 4 caracteres y maximo 50' });
    }
    
    // Verificar que email sea un email válido y tenga como máximo 100 caracteres
    if (!validateEmail(email) || email.length > 100) {
      return res.status(400).json({ error: 'El email debe ser válido y tener máximo 100 caracteres' });
    }
  
    // Verificar que password sea una cadena y tenga como máximo 100 caracteres
    if (typeof password !== 'string' || password.length > 100) {
      return res.status(400).json({ error: 'La contraseña debe ser una cadena de máximo 100 caracteres' });
    }
  
    // Si pasa todas las validaciones, continuar con la ejecución
    next();
  };

  // Middleware de autenticación
const authenticateToken = async (req, res, next) => { 
    const { authorization } = req.headers; // Obtiene el token de autorización de los encabezados de la solicitud

    if (!authorization) return res.status(401).send('Token no proporcionado'); // Si no hay token, responde con un error 401

    try {
        const encoder = new TextEncoder(); // Crea un nuevo TextEncoder
        const { payload } = await jwtVerify(authorization, encoder.encode(process.env.secret)); // Verifica el token y extrae el payload
        req.user = payload; // Asigna el payload del token al objeto req.user
        next(); // Llama al siguiente middleware
    } catch (err) {
        console.error(err); // Imprime el error en la consola
        return res.status(401).send('Token inválido o expirado'); // Responde con un error 401 si el token es inválido o ha expirado
    }
};
  
  export { validateUser, authenticateToken, validateEmail};