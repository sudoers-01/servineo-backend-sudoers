import { Router } from 'express';
import HealthRoutes from '../modules/health/health.routes';
import FixersRoutes from '../modules/fixers/fixers.routes';
import RequestedJobsRoutes from '../modules/requested-jobs/requested-jobs.routes';
import JobsRoutes from '../modules/jobs/jobs.routes';
import CommentRoutes from '../modules/comments/comment.routes';
import ProfileRoutes from '../modules/profile/profile.routes';
import RatingsRoutes from '../modules/ratings/rating.routes';
import RatingsDetailsRoutes from '../modules/ratings-details/routes';
import JobInfoRoutes from '../modules/job-info/routes';
import RatedJobsRoutes from '../modules/rated-jobs/routes';

const router = Router();
router.use('/api/job-info', JobInfoRoutes);
router.use('/api/ratings.details', RatingsDetailsRoutes);
router.use('/api/health', HealthRoutes);
router.use('/api/requested-jobs', RequestedJobsRoutes);
router.use('/api/jobs', JobsRoutes);
router.use('/api/comments', CommentRoutes);
router.use('/api', ProfileRoutes);
router.use('/api', FixersRoutes);
router.use('/api/ratings', RatingsRoutes);
router.use('/api/rated-jobs', RatedJobsRoutes);

router.use((req, res) => {
  console.log('Not found:', req.method, req.originalUrl);
  res.status(404).send({ message: 'Route not found' });
});

export default router;
