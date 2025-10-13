import {Router} from 'express'
import { 
    createLocation,
    insertOneLocation,
    insertManyLocations,
    createAppointment,
    insertOneAppointment,
    insertManyAppointments
} from './create_controller'

const router = Router();

router.get('/locations/create', createLocation);
router.get('/locations/insert_one', insertOneLocation);
router.get('/locations/insert_many', insertManyLocations);
router.get('/appointments/create', createAppointment);
router.get('/appointments/insert_one', insertOneAppointment);
router.get('/appointments/insert_many', insertManyAppointments);