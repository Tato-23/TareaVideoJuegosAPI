import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.js';
import { registerSchema, loginSchema, refreshTokenSchema } from '../schema/authschema.js';

const router = Router();

router.post('/register', validate(registerSchema),     authController.register);
router.post('/login',    validate(loginSchema),        authController.login);
router.post('/refresh',  validate(refreshTokenSchema), authController.refresh);
router.post('/logout',   validate(refreshTokenSchema), authController.logout);

export default router;
