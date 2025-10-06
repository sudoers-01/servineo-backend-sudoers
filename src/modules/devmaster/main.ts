import { Router } from 'express';
import serviciosRoutes from './routes/servicios.routes';

const devmasterRoutes = Router();

devmasterRoutes.use(serviciosRoutes);

export default devmasterRoutes;
