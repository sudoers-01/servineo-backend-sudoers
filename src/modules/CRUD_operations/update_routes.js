import { Router } from 'express';

import * as UpdateModule from './update_controller.js';

const router = Router();

// * Fixed Endpoint Pichon: Refactorizar y probar en Postman.
// * El endpoint estaba actualizando mas slots de los que deberia, ahora con el nuevo esquema actualiza lo solicitado.
router.put('/appointments/update_by_id', UpdateModule.updateAppointmentById);

export default router;