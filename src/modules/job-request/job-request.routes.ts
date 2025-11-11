import { Router } from 'express';
import * as controller from './job-request.controller';

const router = Router();

router.get('/', controller.getAllJobRequests);
router.get('/:id', controller.getJobRequestById);
router.post('/', controller.createJobRequest);

export default router;
