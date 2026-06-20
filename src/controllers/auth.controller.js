import * as authService from '../services/auth.service.js';

export async function register(req, res, next) {
    try {
        const result = await authService.register(req.body);
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
}

export async function login(req, res, next) {
    try {
        const result = await authService.login(req.body);
        res.json(result);
    } catch (err) {
        next(err);
    }
}

export async function refresh(req, res, next) {
    try {
        const result = await authService.refreshToken(req.body);
        res.json(result);
    } catch (err) {
        next(err);
    }
}

export async function logout(req, res, next) {
    try {
        await authService.logout(req.body);
        res.status(204).end();
    } catch (err) {
        next(err);
    }
}
