// read_routes.js
import { Router } from 'express';
import {
  getAllLocations,
  getLocationByDisplayName,
  getManyLocationsByDisplayName,
  getLocationByPlaceId,
  getManyLocationsByPlaceId,
  getLocationsByQueryProjection,
  getAllAppointments,
  getAppointmentByQueryProjection,
  getRequesterSchedulesByFixerMonth,
  getAllRequesterSchedulesByFixerMonth
} from './read_controller';

const router = Router();

router.get('/locations/get_all', getAllLocations);
router.post('/locations/get_by_display_name', getLocationByDisplayName);
router.get('/locations/get_many_by_display_name', getManyLocationsByDisplayName);
router.get('/locations/get_by_place_id', getLocationByPlaceId);
router.get('/locations/get_many_by_place_id', getManyLocationsByPlaceId);
router.get('/locations/get_by_query_projection', getLocationsByQueryProjection);

// Obtener todas las citas
router.get('appointments/get_all', getAllAppointments);

// Obtener citas por query específica (query enviada en body)
router.get('/appointments/get_by_query_projection', getAppointmentByQueryProjection);

// Obtener horarios de un requester en un mes específico - requester-schedules
router.get('/schedules/get_by_fixer_current_requester_month', getRequesterSchedulesByFixerMonth);

// Obtener todos los horarios de otros requesters de un fixer en un mes específico
router.get('/schedules/get_by_fixer_other_requesters_month', getAllRequesterSchedulesByFixerMonth);

export default router;
