import { Router } from 'express';
import serviceRoutes from './routes/service.routes';
import jobRoutes from './routes/job.routes';
import sortRoutes from './routes/sort.routes'

const devmasterRoutes = Router();

devmasterRoutes.use(serviceRoutes);
devmasterRoutes.use(jobRoutes);
devmasterRoutes.use(sortRoutes);

export default devmasterRoutes;
