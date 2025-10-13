import { Router } from 'express';
import * as ProfileController from './profile.controller';

const router = Router();

router.get('/profile/:Id', ProfileController.getProfileData);

router.get('/averageFixers', ProfileController.getAllFixersAverage);

export default router;
