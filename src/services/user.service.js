import { AppError } from "../errors/AppError.js";
import * as userRepository from "../repositories/user.repository.js";

export async function applyRole(userId, role) {
    const user = await userRepository.findById(userId);
    if (!user) {
        throw new AppError("Usuario no encontrado", 404);
    }
    await userRepository.applyRole(user, role);
    return user;
}

