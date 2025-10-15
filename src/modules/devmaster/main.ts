import { Router } from 'express';
import serviciosRoutes from './routes/servicios.routes';
import jobRoutes from './routes/offer.routes'
import sortRoutes from './routes/sort.routes'

const devmasterRoutes = Router();

devmasterRoutes.use(serviciosRoutes);
devmasterRoutes.use('/offers', jobRoutes);
devmasterRoutes.use(sortRoutes);

export default devmasterRoutes;
