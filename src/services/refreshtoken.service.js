import crypto from "crypto";
import { AppError } from "../error/AppError.js";
import * as refreshTokenRepository from "../repositories/refreshToken.repository.js";

const REFRESH_TTL_DAYS = Number(process.env.REFRESH_TTL_DAYS) || 7;

export async function issueRefreshToken(userId) {
    const token = crypto.randomBytes(40).toString("hex");
    const expiresAt = new Date(Date.now() + REFRESH_TTL_DAYS * 24 * 60 * 60 * 1000);

    await refreshTokenRepository.create({ token, userId, expiresAt });

    return token;
}

export async function rotateRefreshToken(oldToken) {
    const stored = await refreshTokenRepository.findByToken(oldToken);

    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
        if (stored?.userId) {
            await refreshTokenRepository.revokeAllForUser(stored.userId);
        }
        throw new AppError("Refresh token inválido", 401);
    }

    await refreshTokenRepository.revoke(oldToken);

    return issueRefreshToken(stored.userId);
}

export async function revokeRefreshToken(token) {
    await refreshTokenRepository.revoke(token);
}
