import { Router } from 'express'
import { getFixerRatingsController } from './controllers/ratings.controller'

const router = Router()

router.get('/fixers/:fixerId/ratings', getFixerRatingsController)

export default router