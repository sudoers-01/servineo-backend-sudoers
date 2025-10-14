import { Router } from 'express';
import {
  createLocation,
  insertOneLocation,
  insertManyLocations,
  createAppointment,
  insertOneAppointment,
  insertManyAppointments,
  createAppointmentWithFixerRequester,
  insertOneAppointmentWithFixerRequester,
  insertManyAppointmentsWithFixersRequesters,
} from './create_controller.js';

const router = Router();

// Rutas para Locations
router.get('/locations/create', createLocation);
router.get('/locations/insert_one', insertOneLocation);
router.get('/locations/insert_many', insertManyLocations);

// Rutas para Appointments (básicas)
router.post('/appointments/create', createAppointment);
router.get('/appointments/insert_one', insertOneAppointment);
router.get('/appointments/insert_many', insertManyAppointments);

// Rutas para Appointments con Fixer y Requester (usan POST porque reciben body)
router.post('/appointments/create_with_fixer_requester', createAppointmentWithFixerRequester);
router.post(
  '/appointments/insert_one_with_fixer_requester',
  insertOneAppointmentWithFixerRequester,
);
router.post(
  '/appointments/insert_many_with_fixers_requesters',
  insertManyAppointmentsWithFixersRequesters,
);

export default router;
