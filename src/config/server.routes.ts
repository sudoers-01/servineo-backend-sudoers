import { Router } from 'express';
import HealthRoutes from '../modules/health/health.routes';
import RequestedJobsRoutes from '../modules/requested-jobs/requested-jobs.routes';
import JobsRoutes from '../modules/jobs/jobs.routes';
import CommentRoutes from '../modules/comments/comment.routes';

const router = Router();

router.use('/api/health', HealthRoutes);
router.use('/api/requested-jobs', RequestedJobsRoutes);
router.use('/api/jobs', JobsRoutes);
router.use('/api/comments', CommentRoutes);

router.use((req, res) => {
  console.log('Not found:', req.method, req.originalUrl);
  res.status(404).send({ message: 'Route not found' });
});

export default router;
