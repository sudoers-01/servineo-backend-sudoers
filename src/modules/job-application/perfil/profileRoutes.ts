import { Router } from 'express';
import { getLocationController } from './profileController.js';
//import authMiddleware from '../middleware/auth.js'; // adaptarse a la autenticacion que provee el equipo de login

const router = Router();

router.get('/location', getLocationController); // agregar authMiddleware si esta disponible

export default router;
