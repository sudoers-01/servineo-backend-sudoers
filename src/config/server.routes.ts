import { Router } from 'express';
import HealthRoutes from '../modules/health/health.routes';
import FixersRoutes from '../modules/fixers/fixers.routes';

const router = Router();

router.use('/api', HealthRoutes);
router.use('/api', FixersRoutes);

router.use((req, res) => {
  console.log('Not found:', req.method, req.originalUrl);
  res.status(404).send({
    message: 'route not found',
  });
});

export default router;
