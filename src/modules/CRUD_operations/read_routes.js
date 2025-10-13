// read_routes.js
import { Router } from 'express';
import {
  getAllAppointmentsController,
  getAppointmentByQueryController,
  getRequesterSchedulesByFixerMonthController,
  getAllRequesterSchedulesByFixerMonthController
} from './read_controller';

const router = Router();

// Obtener todas las citas
router.get('/appointments', getAllAppointmentsController);

// Obtener citas por query específica (query enviada en body)
router.post('/appointments/query', getAppointmentByQueryController);

// Obtener horarios de un requester en un mes específico
router.get('/appointments/requester-schedules', getRequesterSchedulesByFixerMonthController);

// Obtener todos los horarios de otros requesters de un fixer en un mes específico
router.get('/appointments/all-requester-schedules', getAllRequesterSchedulesByFixerMonthController);

export default router;
