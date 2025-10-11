import { Request, Response } from 'express'
import { getFixerRatingsService } from '../services/ratings.service'

export async function getFixerRatingsController(req: Request, res: Response) {
  try {
    const { fixerId } = req.params
    const ratings = await getFixerRatingsService(fixerId)

    if (!ratings || ratings.length === 0) {
      return res.status(404).json({ message: 'No ratings found for this fixer' })
    }

    return res.status(200).json(ratings)
  } catch (error) {
    console.error('[GET /fixers/:fixerId/ratings]', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
