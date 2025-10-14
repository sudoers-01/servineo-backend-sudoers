import { Router } from 'express';
import serviciosRoutes from './routes/servicios.routes';
import jobRoutes from './routes/job.routes'

const devmasterRoutes = Router();

devmasterRoutes.use(serviciosRoutes);
devmasterRoutes.use('/jobs', jobRoutes);

export default devmasterRoutes;
