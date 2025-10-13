import { Router } from 'express';
import { getLocationController } from './profileController.js';

const router = Router();

router.get('/location', getLocationController);

export default router;
