import { Router } from 'express';
import { 
  getJobs, 
  getJob, 
  filterJobsByFixerNameRange,
  filterJobsByDepartment,
  filterJobs 
} from '../controller/job.controller';

const router = Router();

// Rutas de filtrado
router.get('/filter', filterJobs);                              // GET /jobs/filter?range=A-C&department=La Paz&jobType=Fontanero
router.get('/filterByFixerNameRange', filterJobsByFixerNameRange); // GET /jobs/filterByFixerNameRange?range=A-C
router.get('/filterByDepartment', filterJobsByDepartment);      // GET /jobs/filterByDepartment?department=La Paz

// Rutas generales
router.get('/', getJobs);                                       // GET /jobs
router.get('/:id', getJob);                                     // GET /jobs/:id

export default router;