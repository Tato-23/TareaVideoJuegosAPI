import { pool } from '../db/index.js';

export async function findAll() {
    const { rows } = await pool.query(
        `SELECT g.id, g.titulo, g.genero, g.descripcion,
                g.studio_id, s.nombre AS nombre_estudio,
                g.fecha_creacion
         FROM games g
         INNER JOIN studios s ON g.studio_id = s.id
         ORDER BY g.id`
    );
    return rows;
}

export async function findById(id) {
    const { rows } = await pool.query(
        `SELECT g.id, g.titulo, g.genero, g.descripcion,
                g.studio_id, s.nombre AS nombre_estudio,
                g.fecha_creacion
         FROM games g
         INNER JOIN studios s ON g.studio_id = s.id
         WHERE g.id = $1`,
        [id]
    );
    return rows[0] ?? null;
}

export async function findByTitulo(titulo) {
    const { rows } = await pool.query(
        'SELECT id FROM games WHERE titulo = $1',
        [titulo]
    );
    return rows[0] ?? null;
}

export async function create({ titulo, genero, descripcion, studio_id }) {
    const { rows } = await pool.query(
        `INSERT INTO games (titulo, genero, descripcion, studio_id)
         VALUES ($1, $2, $3, $4)
         RETURNING id, titulo, genero, descripcion, studio_id, fecha_creacion`,
        [titulo, genero ?? null, descripcion ?? null, studio_id]
    );
    return rows[0];
}

export async function update(id, { titulo, genero, descripcion, studio_id }) {
    const { rows } = await pool.query(
        `UPDATE games SET titulo=$1, genero=$2, descripcion=$3, studio_id=$4
         WHERE id=$5
         RETURNING id, titulo, genero, descripcion, studio_id, fecha_creacion`,
        [titulo, genero ?? null, descripcion ?? null, studio_id, id]
    );
    return rows[0] ?? null;
}

export async function remove(id) {
    const { rowCount } = await pool.query('DELETE FROM games WHERE id = $1', [id]);
    return rowCount > 0;
}
