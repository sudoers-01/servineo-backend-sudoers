import { Router } from 'express';
import { getLocation, getAddress } from './location.controller.js';

const router = Router();

router.get('/search', getLocation);
router.get('/reverse', getAddress);

export default router;
