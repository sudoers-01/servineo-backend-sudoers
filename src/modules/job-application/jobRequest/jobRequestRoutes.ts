import { Router } from 'express';
import { createJobRequestController } from './jobRequestController.js';

const router = Router();

router.post('/', createJobRequestController);

export default router;
