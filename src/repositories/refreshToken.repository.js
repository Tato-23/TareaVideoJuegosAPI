import { pool } from '../db/index.js';

export async function create({ token, userId, expiresAt }) {
    await pool.query(
        'INSERT INTO refresh_tokens (token, usuario_id, fecha_expiracion) VALUES ($1, $2, $3)',
        [token, userId, expiresAt]
    );
}

export async function findByToken(token) {
    const { rows } = await pool.query(
        `SELECT id, token, usuario_id AS "userId", fecha_expiracion AS "expiresAt", fecha_revocacion AS "revokedAt"
         FROM refresh_tokens WHERE token = $1`,
        [token]
    );
    return rows[0] ?? null;
}

export async function revoke(token) {
    await pool.query(
        'UPDATE refresh_tokens SET fecha_revocacion = NOW() WHERE token = $1',
        [token]
    );
}

export async function revokeAllForUser(userId) {
    await pool.query(
        'UPDATE refresh_tokens SET fecha_revocacion = NOW() WHERE usuario_id = $1 AND fecha_revocacion IS NULL',
        [userId]
    );
}
