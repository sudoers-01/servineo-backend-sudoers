// src/modules/health/health.routes.ts
import { Router } from 'express';
import { getHealth } from './health.controller';

const router = Router();

// Ruta GET /api/health
router.get('/health', getHealth);

export default router; 