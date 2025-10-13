const { Router } = required ('express');
const { deleteLocationByDisplayName,
    deleteManyLocationsByDisplayName,
    deleteLocationByPlaceId,
    deleteManyLocationsByPlaceId,
    deleteManyLocationsByQuery } =required( "./delete_controller");

const router = Router();

router.get('/delete_location_by_one_name', deleteLocationByDisplayName);
router.get('/delete_locations_by_name', deleteManyLocationsByDisplayName);
router.get('/delete_location_by_one_id', deleteLocationByPlaceId);
router.get('/delete_locations_by_ids', deleteManyLocationsByPlaceId);
router.get('/delete_locations_by_query', deleteManyLocationsByQuery);

