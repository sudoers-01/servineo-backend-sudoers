import { Router } from 'express';

import { getMapLocations, getTrackingMetrics } from '../controllers/tracking-appointments.controller';

const router = Router();
router.get('/map-locations', getMapLocations);
router.get('/metrics', getTrackingMetrics);
export default router;