import * as gameRepository from '../repositories/game.repository.js';
import { AppError } from '../error/AppError.js';

export async function getAll(req, res, next) {
    try {
        const games = await gameRepository.findAll();
        res.json(games);
    } catch (err) {
        next(err);
    }
}

export async function getOne(req, res, next) {
    try {
        const game = await gameRepository.findById(Number(req.params.id));
        if (!game) return next(new AppError('Videojuego no encontrado', 404));
        res.json(game);
    } catch (err) {
        next(err);
    }
}

export async function create(req, res, next) {
    try {
        const existing = await gameRepository.findByTitulo(req.body.titulo);
        if (existing) return next(new AppError('Ya existe un videojuego con ese título', 409));
        const game = await gameRepository.create(req.body);
        res.status(201).json(game);
    } catch (err) {
        next(err);
    }
}

export async function update(req, res, next) {
    try {
        const game = await gameRepository.update(Number(req.params.id), req.body);
        if (!game) return next(new AppError('Videojuego no encontrado', 404));
        res.status(200).json({ message: 'El videojuego ha sido actualizado correctamente', data: game });
    } catch (err) {
        next(err);
    }
}

export async function remove(req, res, next) {
    try {
        const deleted = await gameRepository.remove(Number(req.params.id));
        if (!deleted) return next(new AppError('Videojuego no encontrado', 404));
        res.status(200).json({ message: 'El videojuego ha sido eliminado correctamente' });
    } catch (err) {
        next(err);
    }
}
