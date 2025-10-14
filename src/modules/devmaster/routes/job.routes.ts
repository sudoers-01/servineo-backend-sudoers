import { Router } from 'express';
import { 
  getJobs, 
  getJob, 
  filterJobsByFixerNameRange,
  filterJobs 
} from '../controller/job.controller';

const router = Router();

router.get('/filter', filterJobs);                           // GET /jobs/filter?range=A-C&department=La Paz
router.get('/filterByFixerNameRange', filterJobsByFixerNameRange); // GET /jobs/filterByFixerNameRange?range=A-C

router.get('/', getJobs);                                    // GET /jobs
router.get('/:id', getJob);                                  // GET /jobs/:id

export default router;