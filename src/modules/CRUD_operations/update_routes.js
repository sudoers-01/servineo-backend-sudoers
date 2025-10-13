import { Router } from 'express';
import {
    updateLocationFieldsByDisplayName,
    updateManyLocationsFieldsByDisplayName,
    updateLocationFieldsByPlaceId,
    updateManyLocationsFieldsByPlaceId,
    updateAllLocationsFields,
    updateManyLocationsFieldsByQuery
} from './update_controller';

const router = Router();

router.get('/locations/update_by_display_name', updateLocationFieldsByDisplayName);
router.get('/locations/update_many_by_display_name', updateManyLocationsFieldsByDisplayName);
router.get('/locations/update_by_place_id', updateLocationFieldsByPlaceId);
router.get('/locations/update_many_by_place_id', updateManyLocationsFieldsByPlaceId);
router.get('/locations/update_all', updateAllLocationsFields);
router.get('/locations/update_many_by_query', updateManyLocationsFieldsByQuery);