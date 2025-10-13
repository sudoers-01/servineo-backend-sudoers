import { Router } from 'express';
import { createJobRequestController } from './jobRequestController.js';
//import authMiddleware from '../middleware/auth.js'; // usar el que provee el equipo de login

const router = Router();

// Igual que el ejemplo de tu compañero
router.post('/', createJobRequestController);

export default router;
