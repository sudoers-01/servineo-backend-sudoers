import { Router } from 'express';
import {
  deleteLocationByDisplayName,
  deleteManyLocationsByDisplayName,
  deleteLocationByPlaceId,
  deleteManyLocationsByPlaceId,
  deleteManyLocationsByQuery,
  deleteAppointmentById,
  deleteManyAppointmentsByIds,
  deleteAppointmentByFixerId,
  deleteManyAppointmentsByFixerId,
  deleteAppointmentByRequesterId,
  deleteManyAppointmentsByRequesterId,
  deleteAppointmentsByQuery,
  deleteAllAppointments,
} from './delete_controller.js';

const router = Router();

// Rutas para eliminar Locations
router.delete('/locations/delete_by_display_name', deleteLocationByDisplayName);
router.delete('/locations/delete_many_by_display_name', deleteManyLocationsByDisplayName);
router.delete('/locations/delete_by_place_id', deleteLocationByPlaceId);
router.delete('/locations/delete_many_by_place_id', deleteManyLocationsByPlaceId);
router.delete('/locations/delete_many_by_query', deleteManyLocationsByQuery);

// Rutas para eliminar Appointments
router.delete('/appointments/delete_by_id', deleteAppointmentById);
router.delete('/appointments/delete_many_by_ids', deleteManyAppointmentsByIds);
router.delete('/appointments/delete_by_fixer_id', deleteAppointmentByFixerId);
router.delete('/appointments/delete_many_by_fixer_id', deleteManyAppointmentsByFixerId);
router.delete('/appointments/delete_by_requester_id', deleteAppointmentByRequesterId);
router.delete('/appointments/delete_many_by_requester_id', deleteManyAppointmentsByRequesterId);
router.delete('/appointments/delete_by_query', deleteAppointmentsByQuery);
router.delete('/appointments/delete_all', deleteAllAppointments);

export default router;
