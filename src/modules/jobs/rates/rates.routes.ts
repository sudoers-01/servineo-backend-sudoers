import { Router } from 'express';
import * as RatesController from './rates.controller';

const router = Router();

router.get('/jobs', RatesController.getRates);

export default router;