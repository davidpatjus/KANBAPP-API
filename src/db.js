import pg from 'pg';
import dotenv from "dotenv";

dotenv.config();

export const pool = new pg.Pool({
    user: process.env.user,
    host: process.env.host,
    password: process.env.password,
    database: process.env.database,
    port: process.env.db_port,
});

// Test de conexión a la base de datos
pool.connect((err, client, release) => {
    if (err) {
        console.error('Error connecting to PostgreSQL database:', err.stack)
    } else {
        console.log("Connected to PostgreSQL database");
    }
});
