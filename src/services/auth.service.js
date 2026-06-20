import { hashPassword, verifyPassword } from './password.js';
import { AppError } from '../error/AppError.js';
import * as userRepository from '../repositories/user.repository.js';
import * as refreshTokenRepository from '../repositories/refreshToken.repository.js';
import { signAccessToken } from './token.service.js';
import { issueRefreshToken, rotateRefreshToken, revokeRefreshToken } from './refreshtoken.service.js';

export async function register({ nombre_usuario, correo, contrasena }) {
    const existing = await userRepository.findByEmailOrUsername(correo, nombre_usuario);
    if (existing) {
        throw new AppError('El correo o nombre de usuario ya están registrados', 409);
    }

    const passwordHash = await hashPassword(contrasena);
    const user = await userRepository.createUser({ nombre_usuario, correo, passwordHash });

    return { user };
}

export async function login({ correo, contrasena }) {
    const user = await userRepository.findByEmail(correo);

    if (!user || !(await verifyPassword(contrasena, user.passwordHash))) {
        throw new AppError('Credenciales inválidas', 401);
    }

    const accessToken  = signAccessToken({ sub: user.id, nombre_usuario: user.nombre_usuario, correo: user.correo });
    const refreshToken = await issueRefreshToken(user.id);

    return { accessToken, refreshToken };
}

export async function refreshToken({ refreshToken: oldToken }) {
    const stored = await refreshTokenRepository.findByToken(oldToken);
    if (!stored) throw new AppError('Refresh token inválido', 401);

    const newRefreshToken = await rotateRefreshToken(oldToken);

    const user = await userRepository.findById(stored.userId);
    const accessToken = signAccessToken({ sub: user.id, nombre_usuario: user.nombre_usuario, correo: user.correo });

    return { accessToken, refreshToken: newRefreshToken };
}

export async function logout({ refreshToken: token }) {
    if (!token) throw new AppError('Refresh token requerido', 400);
    await revokeRefreshToken(token);
}
