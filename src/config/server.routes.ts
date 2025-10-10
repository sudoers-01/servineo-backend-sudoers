import { Router } from 'express';
import HealthRoutes from '../modules/health/health.routes';
import jobRequestRoutes from '../job-application/routes/jobRequestRoutes.js'; 
import profileRoutes from '../job-application/routes/profileRoutes.js';

const router = Router();

router.use('/api', HealthRoutes);
router.use('/api/jobrequests', jobRequestRoutes);
router.use('/api/jobrequests', profileRoutes);

router.use((req, res) => {
  console.log('Not found:', req.method, req.originalUrl);
  res.status(404).send({
    message: 'route not found',
  });
});

export default router;
