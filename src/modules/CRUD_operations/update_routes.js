import { Router } from 'express';
import {
  updateLocationFieldsByDisplayName,
  updateManyLocationsFieldsByDisplayName,
  updateLocationFieldsByPlaceId,
  updateManyLocationsFieldsByPlaceId,
  updateAllLocationsFields,
  updateManyLocationsFieldsByQuery,
  updateAppointmentById,
  updateManyAppointmentsByIds,
  updateAppointmentsByQuery,
  updateAllAppointments,
  updateAppointmentFieldsByFixerId,
  updateManyAppointmentsByFixerId,
  updateAppointmentFieldsByRequesterId,
  updateManyAppointmentsByRequesterId,
  updateAppointmentsByDateRange,
  updateAppointmentsByStatus,
  updateAppointmentsByType,
} from './update_controller.js';

const router = Router();

// Rutas para actualizar Locations
router.put('/locations/update_by_display_name', updateLocationFieldsByDisplayName);
router.put('/locations/update_many_by_display_name', updateManyLocationsFieldsByDisplayName);
router.put('/locations/update_by_place_id', updateLocationFieldsByPlaceId);
router.put('/locations/update_many_by_place_id', updateManyLocationsFieldsByPlaceId);
router.put('/locations/update_all', updateAllLocationsFields);
router.put('/locations/update_many_by_query', updateManyLocationsFieldsByQuery);

// Rutas para actualizar Appointments - Por ID
router.put('/appointments/update_by_id', updateAppointmentById);
router.put('/appointments/update_many_by_ids', updateManyAppointmentsByIds);

// Rutas para actualizar Appointments - Por Query
router.put('/appointments/update_by_query', updateAppointmentsByQuery);
router.put('/appointments/update_all', updateAllAppointments);

// Rutas para actualizar Appointments - Por Fixer
router.put('/appointments/update_by_fixer_id', updateAppointmentFieldsByFixerId);
router.put('/appointments/update_many_by_fixer_id', updateManyAppointmentsByFixerId);

// Rutas para actualizar Appointments - Por Requester
router.put('/appointments/update_by_requester_id', updateAppointmentFieldsByRequesterId);
router.put('/appointments/update_many_by_requester_id', updateManyAppointmentsByRequesterId);

// Rutas para actualizar Appointments - Por otros criterios
router.put('/appointments/update_by_date_range', updateAppointmentsByDateRange);
router.put('/appointments/update_by_status', updateAppointmentsByStatus);
router.put('/appointments/update_by_type', updateAppointmentsByType);

export default router;
