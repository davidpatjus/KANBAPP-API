import { pool } from '../db.js'; // Importa la conexión a la base de datos desde el archivo db.js
import bcrypt from 'bcrypt'; // Importa bcrypt para el hashing de contraseñas
import { SignJWT } from 'jose'; // Importa funciones para manejar JSON Web Tokens (JWT)

import dotenv from "dotenv"; // Importa dotenv para cargar variables de entorno desde un archivo .env

dotenv.config(); // Carga las variables de entorno desde el archivo .env
const secret = process.env.secret; // Asigna la variable de entorno secret a la constante secret



// Exporta la función getUser que obtiene todos los usuarios de la base de datos
export const getUsers = (async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users'); // Ejecuta una consulta para obtener todos los usuarios
        return res.status(200).json(result.rows); // Responde con los usuarios obtenidos en formato JSON
    } catch (err) {
        console.error(err); // Imprime el error en la consola
        return res.status(500).send('Error retrieving users'); // Responde con un error 500 si hay un problema al obtener los usuarios
    }
})

// Exporta la función getUserById que obtiene un usuario de la base de datos
export const getUserById = async (req, res) => {
    //extraer id del token que se encuentra en las cookies
    const id = req.user.id_users;

    if (!id) return res.status(400).send('Id is necessary'); // Responde con un error 400 si falta el id

    try {
        const result = await pool.query('SELECT * FROM users WHERE id_users = $1', [id]); // Consulta a la base de datos para obtener el usuario con esa id
        if (result.rows.length === 0) {
            return res.status(404).send('User not found'); // Responde con un error 404 si el usuario no se encuentra
        }
    
        res.status(200).json(result.rows[0]); // Responde con el usuario encontrado en formato JSON
    } catch (err) {
        console.error(err); // Imprime el error en la consola
        res.status(500).send('Error retrieving user'); // Responde con un error 500 si hay un problema al obtener el usuario
    }
};


// Exporta la función createUser que crea un nuevo usuario en la base de datos
export const createUser = (async (req, res) => {
    const { name, email, password } = req.body; // Obtiene el nombre, correo electrónico y contraseña del cuerpo de la solicitud
  
    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hashea la contraseña con bcrypt
        const result = await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *', // Inserta el nuevo usuario en la base de datos
            [name, email, hashedPassword]
        );
        res.status(201).json(result.rows[0]); // Responde con el usuario creado en formato JSON
    } catch (err) {
        if (err.code == 23505) return res.status(409).send('Email in use')

        return res.status(500).send('Error creating user'); // Responde con un error 500 si hay un problema al crear el usuario
    }
});

// Exporta la función login que autentica a un usuario y genera un token JWT
export const login = (async (req, res) => {
    const { email, password } = req.body; // Obtiene el correo electrónico y la contraseña del cuerpo de la solicitud
  
    if (!email || !password) return res.status(400).send('Email y contraseña son requeridos'); // Responde con un error 400 si faltan el correo electrónico o la contraseña
  
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]); // Ejecuta una consulta para obtener el usuario por correo electrónico
        const user = result.rows[0];
        
        if (!user) return res.status(401).send('Email inválido'); // Responde con un error 401 si el usuario no existe
        
        const isPasswordValid = await bcrypt.compare(password, user.password); // Compara la contraseña proporcionada con la almacenada
        if (!isPasswordValid) return res.status(401).send('Contraseña inválida'); // Responde con un error 401 si la contraseña es incorrecta
  
        const encoder = new TextEncoder(); // Crea un nuevo TextEncoder
        const id_users = `${user.id_users}`; // Asigna el ID del usuario a la constante id_users
        const jwtConstructor = new SignJWT({ id_users }); // Crea un nuevo JWT con el ID del usuario
        const jwt = await jwtConstructor
            .setProtectedHeader({ alg: 'HS256', typ: 'JWT' }) // Establece el encabezado del JWT
            .setIssuedAt() // Establece la fecha de emisión del JWT
            .setExpirationTime('1h') // Establece la fecha de expiración del JWT
            .sign(encoder.encode(secret)); // Firma el JWT con la clave secreta

            //responder token en una cookie
            res.cookie('token', jwt, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', // Usar solo en producción
            sameSite:'strict',
            maxAge: 3600000
            }); // Responde con el token JWT en una cookie
        
        
        return res.send({ jwt }); // Responde con el JWT generado
    } catch (err) {
        console.error(err); // Imprime el error en la consola
        res.status(500).send('Error al iniciar sesión'); // Responde con un error 500 si hay un problema al iniciar sesión
    }
})

// Exporta la función deleteUser que elimina un usuario de la base de datos
export const deleteUser = (async (req, res) => {
    const  id  = req.user.id_users; // Obtiene el ID del usuario de los parámetros de la solicitud

    try {
        const result = await pool.query('DELETE FROM users WHERE id_users = $1 RETURNING *', [id]); // Ejecuta una consulta para eliminar el usuario por ID
        const user = result.rows[0];

        if (!user) return res.status(404).send('Usuario no encontrado'); // Responde con un error 404 si el usuario no existe

        res.status(200).json(user); // Responde con el usuario eliminado en formato JSON
    } catch (err) {
        console.error(err); // Imprime el error en la consola
        res.status(500).send('Error al eliminar el usuario'); // Responde con un error 500 si hay un problema al eliminar el usuario
    }
})

// Exporta la función actualizateUser que actualiza la información de un usuario en la base de datos
export const actualizateUser = (async (req, res) => {
    const  id  = req.user.id_users;// Obtiene el ID del usuario de los parámetros de la solicitud
    const { name, email, password } = req.body; // Obtiene el nombre, correo electrónico y contraseña del cuerpo de la solicitud

    if (!name || !email || !password) return res.status(401).send('Faltan datos'); // Responde con un error 401 si faltan datos

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hashea la contraseña con bcrypt
        const result = await pool.query(
            'UPDATE users SET name = $1, email = $2, password = $3 WHERE id_users = $4 RETURNING *', // Ejecuta una consulta para actualizar el usuario por ID
            [name, email, hashedPassword, id]
        );
        const user = result.rows[0];

        if (!user) return res.status(404).send('Usuario no encontrado'); // Responde con un error 404 si el usuario no existe

        delete user.password; // Elimina la contraseña del objeto usuario

        return res.status(200).json(user); // Responde con el usuario actualizado en formato JSON
    } catch (err) {
        console.error(err); // Imprime el error en la consola
        res.status(500).send('Error al actualizar el usuario'); // Responde con un error 500 si hay un problema al actualizar el usuario
    }
})

