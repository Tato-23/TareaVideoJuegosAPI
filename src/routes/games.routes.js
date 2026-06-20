import { Router } from 'express';
import * as gamesController from '../controllers/games.controller.js';
import { requireAuth } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { gameSchema } from '../schema/game.schema.js';

const router = Router();

router.get('/',     gamesController.getAll);
router.get('/:id',  gamesController.getOne);
router.post('/',    requireAuth, validate(gameSchema), gamesController.create);
router.put('/:id',  requireAuth, validate(gameSchema), gamesController.update);
router.delete('/:id', requireAuth, gamesController.remove);

export default router;
