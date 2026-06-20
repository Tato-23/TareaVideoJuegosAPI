import { Router } from 'express';
import * as studiosController from '../controllers/studios.controller.js';
import { requireAuth } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { studioSchema } from '../schema/studios.schema.js';

const router = Router();

router.get('/',             studiosController.getAll);
router.get('/:id/games',   studiosController.getGames);
router.get('/:id',         studiosController.getOne);
router.post('/',           requireAuth, validate(studioSchema), studiosController.create);
router.put('/:id',         requireAuth, validate(studioSchema), studiosController.update);
router.delete('/:id',      requireAuth, studiosController.remove);

export default router;
