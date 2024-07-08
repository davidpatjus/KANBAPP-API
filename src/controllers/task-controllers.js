import { pool } from "../db.js"; // Importa la conexión a la base de datos
import { marked } from 'marked'; // Importa la biblioteca para convertir Markdown a HTML

/**
 * Obtiene todas las tareas de la base de datos.
 * @param {Object} req - Objeto de solicitud Express.
 * @param {Object} res - Objeto de respuesta Express.
 */
export const getTask = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tasks'); // Consulta todas las tareas
        res.status(200).json(result.rows); // Envía las tareas como respuesta JSON
    } catch (err) {
        console.error(err); // Registra el error en la consola
        res.status(500).send('Error retrieving users'); // Envía un mensaje de error
    }
}

/**
 * Crea una nueva tarea en la base de datos.
 * @param {Object} req - Objeto de solicitud Express.
 * @param {Object} res - Objeto de respuesta Express.
 */
export const createTask = async (req, res) => {
    const { title, body, id_section } = req.body; // Extrae datos del cuerpo de la solicitud
    
    const htmlBody = marked(body); // Convierte el cuerpo Markdown a HTML
  
    try {
        const result = await pool.query(
            'INSERT INTO tasks (title, body, id_section) VALUES ($1, $2, $3) RETURNING *',
            [title, htmlBody, id_section]
        ); // Inserta la nueva tarea en la base de datos
        res.status(201).json(result.rows[0]); // Envía la tarea creada como respuesta JSON
    } catch (err) {
        console.error(err); // Registra el error en la consola
        res.status(500).send('Error creating task'); // Envía un mensaje de error
    }
}

/**
 * Actualiza una tarea existente en la base de datos.
 * @param {Object} req - Objeto de solicitud Express.
 * @param {Object} res - Objeto de respuesta Express.
 */
export const updateTask = async (req, res) => {
    const { task_id } = req.params; // Obtiene el ID de la tarea de los parámetros de la URL
    const { title, body, id_section } = req.body; // Extrae datos del cuerpo de la solicitud
    
    const htmlBody = marked(body); // Convierte el cuerpo Markdown a HTML
    
    try {
        const result = await pool.query(
            'UPDATE tasks SET title=$1, body=$2, id_section=$3 WHERE id_task=$4 RETURNING *',
            [title, htmlBody, id_section, task_id]
        ); // Actualiza la tarea en la base de datos
        res.status(200).json(result.rows[0]); // Envía la tarea actualizada como respuesta JSON
    } catch (err) {
        console.error(err); // Registra el error en la consola
        res.status(500).send('Error updating task'); // Envía un mensaje de error
    }
}

/**
 * Elimina una tarea de la base de datos.
 * @param {Object} req - Objeto de solicitud Express.
 * @param {Object} res - Objeto de respuesta Express.
 */
export const deleteTask = async (req, res) => {
    const { task_id } = req.params; // Obtiene el ID de la tarea de los parámetros de la URL
    
    try {
        const result = await pool.query(
          "DELETE FROM tasks WHERE id_task = $1 RETURNING *",
          [task_id]
        ); // Elimina la tarea de la base de datos
        res.status(200).json(result.rows[0]); // Envía la tarea eliminada como respuesta JSON
    } catch (err) {
        console.error(err); // Registra el error en la consola
        res.status(500).send('Error deleting task'); // Envía un mensaje de error
    }
}
