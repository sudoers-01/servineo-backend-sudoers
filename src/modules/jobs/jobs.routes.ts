import express from 'express';
import { changeToPendingPaymentController } from './controllers/jobs.controller';

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({ message: 'Jobs endpoint is working' });
});

router.patch('/:jobId', changeToPendingPaymentController);

export default router;
