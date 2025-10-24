import { Router } from 'express';
import { getJobInfoHandler } from './controller';

const router = Router();

router.get('/:id', getJobInfoHandler);

export default router;
