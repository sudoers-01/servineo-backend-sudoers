import { Router } from 'express'
import { getFixerRatingsController } from './controllers/ratings.controller'

const router = Router()

// Ruta: GET /api/fixers/:fixerId/ratings
router.get('/fixers/:fixerId/ratings', getFixerRatingsController)

export default router