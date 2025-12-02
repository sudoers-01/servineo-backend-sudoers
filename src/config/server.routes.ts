import { Router } from 'express';
import HealthRoutes from '../api/routes/health.routes';

import AuthRoutes from '../api/routes/userManagement/auth.routes';
import offerUpdateRouter from '../api/routes/offerUpdate.routes';


const router = Router();

// Todas las rutas de health bajo /api
router.use('/api', HealthRoutes);
router.use('/api/auth', AuthRoutes);
router.use('/api/offers', offerUpdateRouter);


// Manejo de rutas no encontradas
router.use((req, res) => {
  console.log('Not found:', req.method, req.originalUrl);
  res.status(404).send({
    message: 'route not found',
  });
});

export default router;