import { Router } from 'express';
import {
  getRequesterSchedulesByFixerMonth,
  getAllRequesterSchedulesByFixerMonth,
  getRequesterSchedulesByFixerDay,
  getAllRequesterSchedulesByFixerDay,
  getModalFormAppointment,
  getMeetingStatus
} from './read_controller.js';

const router = Router();

// Rutas para Schedules - Por mes
// TODO: fixear Endpoint Chamo: -
router.get('/schedules/get_by_fixer_current_requester_month', getRequesterSchedulesByFixerMonth);
//? Endpoint Chamo (consultar)
router.get('/schedules/get_by_fixer_other_requesters_month', getAllRequesterSchedulesByFixerMonth);

// Rutas para Schedules - Por día
// TODO: Fixear Endpoint Arrick: Devuelve mucho 404.
router.get('/schedules/get_by_fixer_current_requester_day', getRequesterSchedulesByFixerDay);
//TODO: Fixear Endpoint Arrick: Unificar con el endpoint de arriba.
router.get('/schedules/get_by_fixer_other_requesters_day', getAllRequesterSchedulesByFixerDay);

// Ruta para Modal Form
// TODO: Fixear Endpoint Pichon: -
router.get('/appointments/get_modal_form', getModalFormAppointment);

// * Fixed Endpoint Mateo: Reemplazar Body por query y verificar que funcione correctamente.
router.get('/appointments/get_meeting_status', getMeetingStatus);

export default router;
