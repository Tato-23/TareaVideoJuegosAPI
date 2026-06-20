import jwt from 'jsonwebtoken';

const { JWT_SECRET, JWT_EXPIRATION } = process.env;

if(!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
}

export function signAccessToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION || '15m' });
}

export function verifyAccessToken(token) {
    return jwt.verify(token, JWT_SECRET);
}