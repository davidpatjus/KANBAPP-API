import { pool } from "../db.js"; // Importa la conexión a la base de datos desde el archivo db.js

// Exporta la función getSection que obtiene todas las secciones de un usuario específico
export const getSection = async (req, res) => {
    const id_usuario = req.params.id_users; // Obtiene el ID de usuario de los parámetros de la solicitud

    try {
        const result = await pool.query('SELECT * FROM sections WHERE id_users = $1', [id_usuario]); // Ejecuta una consulta para obtener todas las secciones del usuario
        res.send(result.rows); // Responde con las secciones obtenidas en formato JSON
    } catch (e) {
        console.error(e); // Imprime el error en la consola
        res.status(500).send('Error retrieving sections'); // Responde con un error 500 si hay un problema al obtener las secciones
    }
}

// Exporta la función createSection que crea una nueva sección para un usuario
export const createSection = (req, res) => {
    const { id_users, title } = req.body; // Obtiene el ID de usuario y el título de la sección del cuerpo de la solicitud

    try {
        const result = pool.query('INSERT INTO sections (id_users, title) VALUES ($1, $2) RETURNING *', [id_users, title]); // Inserta la nueva sección en la base de datos
        //responde con el codigo http y un mensaje claro sobre los cambios realizados
        res
          .status(201)
          .send(
            "Sección creada correctamente"
          );
    } catch (e) {
        console.error(e); // Imprime el error en la consola
        res.status(500).send('Error creating section'); // Responde con un error 500 si hay un problema al crear la sección
    }
}

// Exporta la función deleteSection que elimina una sección de la base de datos
export const deleteSection = async (req, res) => {
    const { id_section } = req.params; // Obtiene el ID de la sección de los parámetros de la solicitud

    try {
        const result = await pool.query('DELETE FROM sections WHERE id_section = $1 RETURNING *', [id_section]); // Ejecuta una consulta para eliminar la sección por ID
        if (result.rowCount > 0) {
            res.send(result.rows); // Responde con las filas afectadas por la eliminación en formato JSON si se encontró y eliminó la sección
        } else {
            res.status(404).send("Sección no encontrada"); // Responde con un error 404 si la sección no fue encontrada en la base de datos
        }
    } catch (e) {
        console.error(e); // Imprime el error en la consola
        res.status(500).send('Error deleting section'); // Responde con un error 500 si hay un problema al eliminar la sección
    }
}

// Exporta la función updateSection que actualiza el título de una sección en la base de datos
export const updateSection = async (req, res) => {
    const { id_section } = req.params; // Obtiene el ID de la sección de los parámetros de la solicitud
    const { title } = req.body; // Obtiene el nuevo título de la sección del cuerpo de la solicitud

    try {
        const result = await pool.query(
            'UPDATE sections SET title = $1 WHERE id_section = $2 RETURNING *', // Ejecuta una consulta para actualizar el título de la sección por ID
            [title, id_section]
        );

        if (result.rowCount === 0) {
            return res.status(404); // Responde con un error 404 si la sección no fue encontrada para actualizar
        }

        res.send(`Se actualizó la sección: ${JSON.stringify(result.rows[0])}`); // Responde con un mensaje de éxito y la sección actualizada en formato JSON
    } catch (e) {
        console.error(`No se pudo actualizar la sección ${id_section}:`, e); // Imprime el error en la consola
        res.status(500).send('Error updating section'); // Responde con un error 500 si hay un problema al actualizar la sección
    }
}
