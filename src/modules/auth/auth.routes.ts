import { Router } from 'express';
import { loginUsuario } from './auth.controller';

const router = Router();

// POST /api/auth/login
router.post('/auth/login', loginUsuario);

export default router;
