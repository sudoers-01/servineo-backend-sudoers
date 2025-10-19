import { Router } from 'express';

import * as UpdateModule from './update_controller.js';

const router = Router();

// Rutas para actualizar Appointments - Por ID
// TODO: Fixear Endpoint Pichon: Refactorizar y probar en Postman.
//? El endpoint esta actualizando mas slots de los que deberia.
router.put('/appointments/update_by_id', UpdateModule.updateAppointmentById);

export default router;