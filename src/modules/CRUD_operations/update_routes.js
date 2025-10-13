const { Router } = required('express');
const {
    updateLocationFieldsByDisplayName,
    updateManyLocationsFieldsByDisplayName,
    updateLocationFieldsByPlaceId,
    updateManyLocationsFieldsByPlaceId,
    updateAllLocationsFields,
    updateManyLocationsFieldsByQuery
} = required('./update_controller');

const router = Router();

router.get('/update_location_by_display_name', updateLocationFieldsByDisplayName);
router.get('/update_many_locations_by_display_name', updateManyLocationsFieldsByDisplayName);
router.get('/update_location_by_place_id', updateLocationFieldsByPlaceId);
router.get('/update_many_location_by_place_id', updateManyLocationsFieldsByPlaceId);
router.get('/update_all_locations', updateAllLocationsFields);
router.get('/update_many_locations_by_query', updateManyLocationsFieldsByQuery);