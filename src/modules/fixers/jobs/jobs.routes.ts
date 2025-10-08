import { Router } from 'express';
import * as JobsController from './jobs.controller';

const router = Router();

router.get('/jobs', JobsController.getJobs);

export default router;
