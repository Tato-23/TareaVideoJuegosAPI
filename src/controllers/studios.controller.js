import * as studioRepository from '../repositories/studio.repository.js';
import { AppError } from '../error/AppError.js';

export async function getAll(req, res, next) {
    try {
        const studios = await studioRepository.findAll();
        res.json(studios);
    } catch (err) {
        next(err);
    }
}

export async function getOne(req, res, next) {
    try {
        const studio = await studioRepository.findById(Number(req.params.id));
        if (!studio) return next(new AppError('Estudio no encontrado', 404));
        res.json(studio);
    } catch (err) {
        next(err);
    }
}

export async function create(req, res, next) {
    try {
        const existing = await studioRepository.findByName(req.body.nombre);
        if (existing) return next(new AppError('Ya existe un estudio con ese nombre', 409));
        const studio = await studioRepository.create(req.body);
        res.status(201).json(studio);
    } catch (err) {
        next(err);
    }
}

export async function update(req, res, next) {
    try {
        const studio = await studioRepository.update(Number(req.params.id), req.body);
        if (!studio) return next(new AppError('Estudio no encontrado', 404));
        res.status(200).json({ message: 'El estudio ha sido actualizado correctamente', data: studio });
    } catch (err) {
        next(err);
    }
}

export async function remove(req, res, next) {
    try {
        const id = Number(req.params.id);
        const gameCount = await studioRepository.countGamesByStudio(id);
        if (gameCount > 0) {
            return next(new AppError('No se puede eliminar el estudio porque tiene videojuegos asociados', 409));
        }
        const deleted = await studioRepository.remove(id);
        if (!deleted) return next(new AppError('Estudio no encontrado', 404));
        res.status(200).json({ message: 'El estudio ha sido eliminado correctamente' });
    } catch (err) {
        next(err);
    }
}

export async function getGames(req, res, next) {
    try {
        const id = Number(req.params.id);
        const studio = await studioRepository.findById(id);
        if (!studio) return next(new AppError('Estudio no encontrado', 404));
        const games = await studioRepository.findGamesByStudio(id);
        res.json({ studio, games });
    } catch (err) {
        next(err);
    }
}
