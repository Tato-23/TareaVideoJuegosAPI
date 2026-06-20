import { verifyAccessToken } from '../services/token.service.js';
import { AppError } from "../error/AppError.js";

export function requireAuth(req, res, next) {
    console.log('requireAuth middleware called');
    const header = req.headers['authorization'];
   

    if(!header || !header.startsWith('Bearer ')) {
        return next(new AppError('Token no proporcionado', 401));
    }

    const token = header.split(' ')[1];

    try {
        const payload = verifyAccessToken(token);
        req.user = { id: payload.sub, role: payload.role };
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return next(new AppError('Token expirado', 401));
        }
        return next(new AppError('Token inválido', 401));
    }
}