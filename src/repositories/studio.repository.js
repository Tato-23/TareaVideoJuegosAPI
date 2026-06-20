import { pool } from '../db/index.js';

export async function findAll() {
    const { rows } = await pool.query(
        `SELECT id, nombre, pais, descripcion, fecha_creacion
         FROM studios ORDER BY id`
    );
    return rows;
}

export async function findById(id) {
    const { rows } = await pool.query(
        `SELECT id, nombre, pais, descripcion, fecha_creacion
         FROM studios WHERE id = $1`,
        [id]
    );
    return rows[0] ?? null;
}

export async function findByName(nombre) {
    const { rows } = await pool.query(
        `SELECT id FROM studios WHERE LOWER(nombre) = LOWER($1)`,
        [nombre]
    );
    return rows[0] ?? null;
}

export async function create({ nombre, pais, descripcion }) {
    const { rows } = await pool.query(
        `INSERT INTO studios (nombre, pais, descripcion)
         VALUES ($1, $2, $3)
         RETURNING id, nombre, pais, descripcion, fecha_creacion`,
        [nombre, pais ?? null, descripcion ?? null]
    );
    return rows[0];
}

export async function update(id, { nombre, pais, descripcion }) {
    const { rows } = await pool.query(
        `UPDATE studios SET nombre=$1, pais=$2, descripcion=$3
         WHERE id=$4
         RETURNING id, nombre, pais, descripcion, fecha_creacion`,
        [nombre, pais ?? null, descripcion ?? null, id]
    );
    return rows[0] ?? null;
}

export async function remove(id) {
    const { rowCount } = await pool.query('DELETE FROM studios WHERE id = $1', [id]);
    return rowCount > 0;
}

export async function countGamesByStudio(id) {
    const { rows } = await pool.query(
        'SELECT COUNT(*) AS count FROM games WHERE studio_id = $1',
        [id]
    );
    return Number(rows[0].count);
}

export async function findGamesByStudio(id) {
    const { rows } = await pool.query(
        `SELECT g.id, g.titulo, g.genero, g.descripcion,
                g.studio_id, g.fecha_creacion
         FROM games g
         INNER JOIN studios s ON g.studio_id = s.id
         WHERE s.id = $1
         ORDER BY g.id`,
        [id]
    );
    return rows;
}
