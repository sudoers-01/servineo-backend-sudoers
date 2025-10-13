import { Router } from 'express';
import HealthRoutes from '../modules/health/health.routes';
import LabRoutes from '../Innosys/routes/lab/cashpay.routes';

const router = Router();

// /api/healthz
router.use('/', HealthRoutes);
router.get('/healthz', (_req, res) => res.json({ ok: true }));

// /api/lab/*
router.use('/lab', LabRoutes);

router.use((req, res) => {
  console.log('Not found:', req.method, req.originalUrl);
  res.status(404).json({ message: 'route not found' });
});

export default router;
