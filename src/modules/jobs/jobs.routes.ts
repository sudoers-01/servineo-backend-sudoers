import { Router } from 'express';
import { getCompletedJobsController } from './jobs.controller';

const router = Router();

router.get('/completed', getCompletedJobsController);

export default router;
