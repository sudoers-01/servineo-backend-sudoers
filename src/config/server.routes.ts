import { Router } from 'express';
import HealthRoutes from '../modules/health/health.routes';
import commentRoutes from '../modules/comments/comment.routes';

const router = Router();

router.use('/api', HealthRoutes);
router.use('/api/comments', commentRoutes);


router.use((req, res) => {
  console.log('Not found:', req.method, req.originalUrl);
  res.status(404).send({
    message: 'route not found',
  });
});

export default router;
