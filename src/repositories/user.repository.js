import { pool } from '../db/index.js';

export async function findByEmailOrUsername(correo, nombre_usuario) {
    const { rows } = await pool.query(
        'SELECT id FROM users WHERE correo = $1 OR nombre_usuario = $2',
        [correo, nombre_usuario]
    );
    return rows[0] ?? null;
}

export async function findByEmail(correo) {
    const { rows } = await pool.query(
        `SELECT id, nombre_usuario, correo, contrasena_hash AS "passwordHash"
         FROM users WHERE correo = $1`,
        [correo]
    );
    return rows[0] ?? null;
}

export async function findById(id) {
    const { rows } = await pool.query(
        `SELECT id, nombre_usuario, correo FROM users WHERE id = $1`,
        [id]
    );
    return rows[0] ?? null;
}

export async function createUser({ nombre_usuario, correo, passwordHash }) {
    const { rows } = await pool.query(
        `INSERT INTO users (nombre_usuario, correo, contrasena_hash)
         VALUES ($1, $2, $3)
         RETURNING id, nombre_usuario, correo`,
        [nombre_usuario, correo, passwordHash]
    );
    return rows[0];
}
