import { Router } from 'express';
import * as HealthController from './health.controller.js';

const router = Router();

router.get('/healthy', HealthController.getHealthStatusController);

export default router;
