const { Router } = require('express');
const { 
    deleteLocationByDisplayName,
    deleteManyLocationsByDisplayName,
    deleteLocationByPlaceId,
    deleteManyLocationsByPlaceId,
    deleteManyLocationsByQuery 
} = require( "./delete_controller");

const router = Router();

router.get('/locations/delete_by_display_name', deleteLocationByDisplayName);
router.get('/locations/delete_many_by_display_name', deleteManyLocationsByDisplayName);
router.get('/locations/delete_by_one_id', deleteLocationByPlaceId);
router.get('/locations/delete_many_by_ids', deleteManyLocationsByPlaceId);
router.get('/locations/delete_many_by_query', deleteManyLocationsByQuery);