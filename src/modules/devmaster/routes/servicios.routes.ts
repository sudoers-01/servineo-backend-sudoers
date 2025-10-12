import { Router } from 'express';
import { getServiciosByName } from '../controller/servicios.controller';

const router = Router();

// Búsqueda por nombre de servicio contra BD
router.get('/servicios', getServiciosByName);

export default router;
