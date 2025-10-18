import { Router } from 'express';
import {
  createAppointment
} from './create_controller.js';

const router = Router();

// Rutas para Appointments (básicas)
// TODO: Mantener endpoint Vale (revisar si existen fallas con el nuevo esquema de la db).
router.post('/appointments/create', createAppointment);

export default router;
