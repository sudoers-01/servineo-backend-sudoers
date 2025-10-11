import express from 'express';
import { changeStatusController } from './controllers/jobs.controller';

const router = express.Router();

router.get('/jobs', (req, res) => {
  res.send('Jobs endpoint is working');
});

router.patch('/jobs/:jobId', changeStatusController);

export default router;
